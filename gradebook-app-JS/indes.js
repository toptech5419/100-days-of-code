//gradebook app by freecodecamp
function getAverage(scores) {
    let sum = 0;
  
    for (const score of scores) {
      sum += score;
    }
  
    return sum / scores.length;
  }
  
  function getGrade(score) {
    if (score >= 70) {
      return "A";
    } else if (score >= 60) {
      return "B";
    } else if (score >= 50) {
      return "C";
    } else if (score >= 45) {
      return "D";
    } else if(score >= 40){
        return "E";
    }else {
      return "F";
    }
  }
  
  function hasPassingGrade(score) {
    return getGrade(score) !== "F";
  }

  function studentMsg(totalScores, studentScore) {
    if(hasPassingGrade(studentScore)){
      return `Class average: ${getAverage(totalScores)}. Your grade: ${getGrade(studentScore)}. You passed the course.`
    }
    else {
      return `Class average: ${getAverage(totalScores)}. Your grade: ${getGrade(studentScore)}. You failed the course.`
    }
    }
    console.log(studentMsg([92, 88, 12, 77, 57, 100, 67, 38, 97, 89], 37));