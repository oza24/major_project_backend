const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma");
const ApiError = require("../utils/ApiError");

const registerUser = async ({ name, email, phone, password, role }) => {
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email },
                ...(phone ? [{ phone }] : [])
            ]
        }
    });

    if (existingUser) {
        throw new ApiError(
            "User with this email or phone already exists",
            409,
            "DUPLICATE_ENTRY"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            phone,
            passwordHash: hashedPassword,
            role: role || "PATIENT"
        },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true
        }
    });

    return user;
};

const loginUser = async ({ email, password }) => {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatch = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatch) {
        throw new Error("Invalid email or password");
    }

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );

    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role
        }
    };
};

module.exports = {
    registerUser,
    loginUser
};