import bcrypt from "bcryptjs";


const passwordTest = "11083765";

const hashBDD =
"$2b$10$yPFlSbH3e/3fIg.Vd.Ii6.p6qvss5JsRDxvsCnLxjmh/dbBzRy9bO";


const result = await bcrypt.compare(
  passwordTest,
  hashBDD
);


console.log(result);