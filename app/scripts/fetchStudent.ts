import Student from "../types/student";

// FUNCTION TO FETCH STUDENT INFORMATION (NON-CRITICAL)
export default async function fetchStudent(studentID: string) {
  try {
    const res = await fetch("../user-auth/api/fetchStudentInfo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentID,
      }),
      cache: "no-cache",
      credentials: "include",
    });

    const resBody: {
      data: Student;
      status: number;
    } = JSON.parse(await res.text());

    if (resBody.status === 400) {
      return false;
    }

    return resBody.data;
  } catch (error) {
    console.error("[FETCH STUDENT] Error:\n", error);
  }
}
