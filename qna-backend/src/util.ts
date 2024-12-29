export const formatQuestion = (record: any) => ({
  id: record.id,
  _recordId: record.fields._recordId,
  companyName: record.fields["Company Name"],
  questionDescription: record.fields["Question Description"],
  question: record.fields.Question,
  answer: record.fields.Answer,
  assignedTo: record.fields["Assigned To"]
    ? {
        email: record.fields["Assigned To"],
        status: "assigned", // Assuming status is always "assigned" if assignedTo exists
      }
    : undefined,
  _companyId: record.fields._companyId,
  properties: record.fields.Properties,
  createdAt: record.fields["Created At"],
  updatedAt: record.fields["Updated At"],
  updatedBy: record.fields["Updated By"],
  createdBy: record.fields["Created By"],
});
