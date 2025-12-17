import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/db";
import Transaction from "@/models/Transaction";
import Component from "@/models/Component";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    // Extract responseMessage along with status
    const { status, responseMessage } = await request.json(); 
    const { id } = await params;
    const transactionId = id;

    await connectToDatabase();

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    // Update Status
    transaction.status = status;
    
    // Update Message if provided
    if (responseMessage) {
        transaction.responseMessage = responseMessage;
    }

    await transaction.save();

    // Logic for Component Status
    if (status === "ACTIVE") {
      await Component.findByIdAndUpdate(transaction.componentId, {
        status: "BORROWED",
      });
    }

    if (status === "COMPLETED" || status === "REJECTED" || status === "CANCELLED") {
      await Component.findByIdAndUpdate(transaction.componentId, {
        status: "AVAILABLE",
      });
    }

    return NextResponse.json({ message: "Status updated", transaction }, { status: 200 });

  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}