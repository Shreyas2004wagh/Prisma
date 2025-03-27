import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
const app = express();

app.use(express.json());

const prisma = new PrismaClient();

app.get("/", (req: Request, res: Response) => {
    res.send("Hello World");
});

app.post("/", async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const user = await prisma.user.create({
        data: { username:username, email:email, password:password },
    });
    res.json(user);
});

app.post("/createManyUsers", async (req: Request, res: Response) => {
    const {userList} = req.body;
    const users = await prisma.user.createMany({
       data:userList,
    });
    res.json(users);
});

app.post("/createManyCars", async (req: Request, res: Response) => {
    const {carList} = req.body;
    const cars = await prisma.car.createMany({
       data:carList,
    });
    res.json(cars);
});

app.get("/users", async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({include:{cars:true}});
    res.json(users);
});

app.get("/byid/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const user = await prisma.user.findUnique({
        where: { id:Number(id) },
    });
    res.json(user);
});


app.put("/", async (req: Request, res: Response) => {
   const { id,username } = req.body;
   const updatedUser=await prisma.user.update({
    where: { id:id },
    data: { username:username },
   });
   res.json(updatedUser);
});

app.delete("/:id", async (req: Request, res: Response) => {
    const id = req.params.id;
    const deletedUser = await prisma.user.delete({
        where: { id:Number(id) },
    });
    res.json(deletedUser);

});

app.post("/createUsersWithCars", async (req: Request, res: Response) => {
    const {username, email, password, cars} = req.body;
    try {
        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    username,
                    email,
                    password,
                    cars: {
                        create: cars.map((car: {model: string; year: number}) => ({
                            model: car.model,
                            year: car.year
                        }))
                    }
                }
            });
            return user;
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: "Failed to create user with cars" });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});



