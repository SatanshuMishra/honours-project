import React from "react";

function QuestionPill() {
  const isActive = false;
  const isCorrect = false;
  return (
    <section
      style={
        {
          "--bg": isActive ? "#FFFFFF" : isCorrect ? "#2bcf57" : "#d9023b",
        } as any
      }
    >
      <div className="w-5 p-0.5 rounded-md bg-[--bg]"></div>
    </section>
  );
}

export default QuestionPill;
