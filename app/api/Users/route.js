import { NextResponse } from "next/server";
import User from "@/app/{models}/user";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const body = await req.json();
    const userData = body.formData;

    //Confirm Data Exists
    if (!userData?.email || !userData.password) {
      return NextResponse.json(
        { message: "All Fields are required" },
        { status: 400 }
      );
    }

    //Check for duplicate emails
    const duplicate = await User.findOne({ email: userData.email })
      .lean()
      .exec();

    if (duplicate) {
      return NextResponse.json({ message: "Duplicate Email" }, { status: 409 });
    }

    const hashpassword = await bcrypt.hash(userData.password, 10);
    userData.password = hashpassword;

    await User.create(userData);
    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
