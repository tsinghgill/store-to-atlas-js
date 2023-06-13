
exports.App = class App {
  // Create a custom named function on the App to be applied to your records
  anonymize(records) {
    records.forEach((record) => {
      console.log("record", record)

    });

    // Use records `unwrap` transform on CDC formatted records
    // Has no effect on other formats
    records.unwrap();

    return records;
  }

  async run(turbine) {

    let source = await turbine.resources("store-mongo");

    let records = await source.records("medicine");

    let anonymized = await turbine.process(records, this.anonymize);

    let destination = await turbine.resources("tanveets-atlas");

    await destination.write(anonymized, "aggregated");
  }
};

    // await destination.write(anonymized, "aggregated", {
    //   "document.id.strategy":"com.mongodb.kafka.connect.sink.processor.id.strategy.PartialValueStrategy",
    //   "document.id.strategy.partial.value.projection.list":"patient_id,order_id",
    //   "document.id.strategy.partial.value.projection.type":"AllowList",
    //   "writemodel.strategy":"com.mongodb.kafka.connect.sink.writemodel.strategy.ReplaceOneBusinessKeyStrategy",
    // });
