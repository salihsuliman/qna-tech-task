import express, { Request, Response } from "express";
import dotenv from "dotenv";
import Airtable from "airtable";
import bodyParser from "body-parser";
import { check, validationResult } from "express-validator";
import cors from "cors";
import { formatQuestion } from "./util";
import natural from "natural";

dotenv.config();

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.BASE_ID || ""
);
const table = base("Questions");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

const formatError = (errors: any) => errors.array().map((err: any) => err.msg);

// Clear stopwords, this is to allow TfIdf to score every word.
natural.TfIdf.prototype.setStopwords([]);

/**
 * Create a New Question
 */
app.post(
  "/questions",
  [
    check("question").notEmpty().withMessage("Question is required"),
    check("createdBy").isEmail().withMessage("Valid email is required"),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: formatError(errors) });
      return;
    }

    const {
      question,
      questionDescription,
      createdBy,
      properties,
      answer,
      updatedBy,
      assignedTo,
    } = req.body;

    try {
      const createdRecord = await table.create(
        {
          Question: question,
          "Question Description": questionDescription || "",
          "Created By": createdBy,
          "Updated By": updatedBy || createdBy,
          "Created At": new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 16),
          "Updated At": new Date()
            .toISOString()
            .replace("T", " ")
            .substring(0, 16),
          "Company Name": "Test Company Limited",
          Answer: answer,
          "Assigned To": assignedTo || "",
          _companyId: 63297,
          Properties: properties || "",
        },
        { typecast: true }
      );

      table.update(createdRecord.id, {
        _recordId: createdRecord.id,
      });

      res.status(201).json(formatQuestion(createdRecord));
      return;
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to create question", details: error });
      return;
    }
  }
);

/**
 * Fetch a Question by ID
 */
app.get(
  "/questions/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const records = await table.select().all();

      const question = records.find((record) => record.fields._recordId === id);
      if (!question) {
        res.status(404).json({ error: "Question not found" });
        return;
      }

      res.status(200).json(formatQuestion(question));
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to fetch question", details: error });
    }
  }
);

/**
 * Fetch All Questions with Filters
 */
app.get("/questions", async (req: Request, res: Response): Promise<void> => {
  const { properties, query } = req.query;

  try {
    const records = await table.select().all();
    let filteredRecords = records;

    if (properties) {
      const propsArray = (properties as string).split(",");
      filteredRecords = filteredRecords.filter((record) => {
        const recordProps = ((record.fields.Properties as string) || "").split(
          ","
        );
        return propsArray.every((prop) => recordProps.includes(prop));
      });
    }

    if (query) {
      const tokenizer = new natural.WordTokenizer();
      const tfidf = new natural.TfIdf();

      filteredRecords.forEach((record) => {
        const question = (record.fields.Question as string) || "";
        const answer = (record.fields.Answer as string) || "";

        const tokens = tokenizer.tokenize(
          (question + " " + answer).toLowerCase()
        );
        tfidf.addDocument(tokens.join(" "));
      });

      const queryStr = query as string;
      const scores: { index: number; score: number }[] = [];
      tfidf.tfidfs(queryStr, (i, measure) => {
        scores.push({ index: i, score: measure });
      });

      scores.sort((a, b) => b.score - a.score);
      filteredRecords = scores
        .filter((score) => score.score > 0)
        .map((score) => filteredRecords[score.index]);
    }

    res.status(200).json(filteredRecords.map((rec) => formatQuestion(rec)));
    return;
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to fetch questions", details: error });
    return;
  }
});

/**
 * Update a Question or Answer
 */
app.put(
  "/questions/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
      question,
      questionDescription,
      createdBy,
      properties,
      answer,
      updatedBy,
      assignedTo,
    } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: formatError(errors) });
      return;
    }

    const updateData: any = {};

    if (question) updateData.Question = question;
    if (questionDescription !== undefined)
      updateData["Question Description"] = questionDescription;
    if (createdBy) updateData["Created By"] = createdBy;
    if (updatedBy) updateData["Updated By"] = updatedBy;
    else if (createdBy) updateData["Updated By"] = createdBy; // Fallback to createdBy if updatedBy is not provided
    if (answer !== undefined) updateData.Answer = answer;
    if (assignedTo !== undefined) updateData["Assigned To"] = assignedTo;
    if (properties !== undefined) updateData.Properties = properties;

    updateData["Updated At"] = new Date()
      .toISOString()
      .replace("T", " ")
      .substring(0, 16);
    updateData["Company Name"] = "Test Company Limited";

    try {
      const updatedRecord = await table.update(id, updateData, {
        typecast: true,
      });

      res.status(200).json(formatQuestion(updatedRecord));
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update question", details: error });
    }
  }
);

app.delete(
  "/questions/:id",
  async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      await table.destroy(id);
      res.status(200).json({ message: "Question deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete question", details: error });
    }
  }
);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
