// // Database

// // create data
// INSERT INTO

// // read data
// SELECT

// // update data
// UPDATE

// // delete data
// DELETE

// // Tương tác service xuống database

// SELECT * FROM User

// PrismaClient => cầm `SELECT * FROM User` gọi xuống database => Raw query (Tương tác bằng các câu lệnh query gốc, query thuần túy)

// // ORM (Object relational mapping)
// PrismaClient => build sẵn 1 bộ các function để thực thi các câu lệnh query tương ứng
//             => SELECT: user.findMany() => `SELECT * FROM User` => database
//             => INSERT INTO: .create()
//             => UPDATE: .update()
//             => DELETE: .delete()
