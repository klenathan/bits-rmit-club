// import * as Express from "express";



// export default class OrderRouter {
//   declare router: Express.Router;
// //   declare controller: OrderController;
//   constructor(db: Sequelize) {
//     // initiate router and controller
//     this.controller = new OrderController(db);
//     this.router = Express.Router();
    
//     // Generate routes
//     this.router.get("/", this.controller.getAllOrders);
//     this.router.post("/", upload.any(), this.controller.createOrder);
//     this.router.get("/:id", this.controller.getByPK);
//     this.router.put("/:id", this.controller.updateOrder);

//     this.router.all("*", function (req, res) {
//       res.status(404).send({ message: "UNAVAILABLE_ROUTE" });
//     });
//   }
// }
