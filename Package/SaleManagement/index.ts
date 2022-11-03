import { Router } from "express";
import { Sequelize } from "sequelize-typescript";
import Order from "./Models/Order.model";
import OrderDetail from "./Models/OrderDetail.model";
import Product from "./Models/Product.model";
import OrderRouter from "./routes/order.routes";
import ProductRouter from "./routes/product.routes";

export default class SaleManagementPackage {
    declare orderRouter: Router
    declare productRouter: Router
    constructor (db: Sequelize) {
        db.addModels([Order, OrderDetail, Product])
        this.orderRouter = new OrderRouter(db).router
        this.productRouter = new ProductRouter(db).router
    }
}