To start a Prisma project, follow these steps:

### **1. Initialize a Node.js Project**

```bash
mkdir prisma-project && cd prisma-project
npm init -y
```

### **2. Install Prisma and Other Dependencies**

```bash
npm install @prisma/client
npm install -D prisma typescript ts-node @types/node
```

### **3. Initialize Prisma**

```bash
npx prisma init
```

This command will create a **`prisma/`** directory with:

* **`schema.prisma`** – Your main Prisma schema file
* **`.env`** – Environment variables (e.g., database connection string)

### **4. Configure the Database**

Update the **`.env`** file with your database URL, for example, for PostgreSQL:

```plaintext
DATABASE_URL="postgresql://username:password@localhost:5432/mydb?schema=public"
```

### **5. Define Your Database Schema**

Edit the **`schema.prisma`** file to define your data models:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id    Int     @id @default(autoincrement())
  name  String
  email String  @unique
  posts Post[]
}

model Post {
  id        Int     @id @default(autoincrement())
  title     String
  content   String
  authorId  Int
  author    User    @relation(fields: [authorId], references: [id])
}
```

### **6. Run the Database Migrations**

```bash
npx prisma migrate dev --name init
```

This will generate the migration files you see in the **`prisma/migrations/`** folder.

### **7. Generate Prisma Client**

```bash
npx prisma generate
```

### **8. Create a Simple Script to Test the Connection**

Create **`index.ts`** to test your connection:

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "john@example.com",
    },
  });
  console.log(user);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
```

### **9. Run the Script**

Make sure you have TypeScript configured (your **`tsconfig.json`** is already there). Then, run:

```bash
npx ts-node index.ts
```

### **10. Use Prisma Studio (Optional)**

To visually manage your database, you can use:

```bash
npx prisma studio
```

---
