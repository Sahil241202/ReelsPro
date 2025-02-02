import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest){

    try{
        const {email,password} = await request.json()

        //If email and password are not provided then send an error
        if(!email || !password){
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 400}
            )
        }

        //connect to database
        await connectToDatabase();

        const existingUser = await User.findOne({email});
        
        //If user already exists then send an error
        if(existingUser){
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            );
        }

        //Create a new user if not existing
        await User.create({
            email,
            password
        })
        //Send response with "User registered successfully" message
        return NextResponse.json(
            {message: "User registered successfully"},
            {status: 201}
        );
    } catch(error) {
        //If any error occurs send response of error
        return NextResponse.json(
            {error:"Failed to create user"},
            {status: 500}
        );
    }
}