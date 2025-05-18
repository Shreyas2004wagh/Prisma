"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const prisma = new client_1.PrismaClient();
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password } = req.body;
    const user = yield prisma.user.create({
        data: { username: username, email: email, password: password },
    });
    res.json(user);
}));
app.post("/createManyUsers", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userList } = req.body;
    const users = yield prisma.user.createMany({
        data: userList,
    });
    res.json(users);
}));
app.post("/createManyCars", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { carList } = req.body;
    const cars = yield prisma.car.createMany({
        data: carList,
    });
    res.json(cars);
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.user.findMany({ include: { cars: true } });
    res.json(users);
}));
app.get("/byid/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const user = yield prisma.user.findUnique({
        where: { id: Number(id) },
    });
    res.json(user);
}));
app.put("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username } = req.body;
    const updatedUser = yield prisma.user.update({
        where: { id: id },
        data: { username: username },
    });
    res.json(updatedUser);
}));
app.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const deletedUser = yield prisma.user.delete({
        where: { id: Number(id) },
    });
    res.json(deletedUser);
}));
app.post("/createUsersWithCars", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, email, password, cars } = req.body;
    try {
        const result = yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const user = yield tx.user.create({
                data: {
                    username,
                    email,
                    password,
                    cars: {
                        create: cars.map((car) => ({
                            model: car.model,
                            year: car.year
                        }))
                    }
                }
            });
            return user;
        }));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create user with cars" });
    }
}));
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
