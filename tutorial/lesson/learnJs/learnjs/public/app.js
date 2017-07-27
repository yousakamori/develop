'use strict';
const learnjs = {};

learnjs.problems = [
  {
    description : "What is truth?",
    code :  "function problem() { return __; }"
  },
  {
    description: "Simple Math",
    code: "function problem(){return 42 === 6 * __ ;}"
  }
];

learnjs.applyObject = (obj, elem)=>{
  for(let key in obj){
    elem.find('[data-name="' + key + '"]').text(obj[key]);
  }
}

learnjs.flashElement = (elem, content)=>{
  elem.fadeOut('fast', ()=>{
    elem.html(content);
    elem.fadeIn();
  });
}

learnjs.template = (name)=>{
  return $('.templates .'+name).clone();
}

learnjs.problemView = (data)=>{
  const problemNumber = parseInt(data, 10);
  const title = 'Problem #' + problemNumber;
  const view = learnjs.template('problem-view');
  const problemData = learnjs.problems[problemNumber-1];
  const resultFlash = view.find('.result');

  function checkAnswer(){
    const answer = view.find('.answer').val();
    const test = problemData.code.replace('__', answer) + '; problem();';
    return eval(test);
  }

  function checkAnswerClick(){

    if(checkAnswer()){
      const correctFlash = learnjs.template('correct-flash');
      correctFlash.find('a').attr('href', '#problem-' + (problemNumber + 1));
      learnjs.flashElement(resultFlash, correctFlash);
      return false;
    }

    learnjs.flashElement( resultFlash, 'Incorrect!');
    return false;
  }

  view.find('.check-btn').on('click', checkAnswerClick);
  view.find('.title').text(title);
  learnjs.applyObject(problemData, view);

  return view;
}

learnjs.showView = function(hash){
  const routes = {
    '#problem' : learnjs.problemView
  };
  const hashParts = hash.split('-');
  const viewFn = routes[hashParts[0]];
  if(!viewFn){
    return;
  }
  $('.view-container').empty().append(viewFn(hashParts[1]));
}
learnjs.appOnReady = ()=>{
  // イベントハンドラの登録
  window.onhashchange = ()=>{
    learnjs.showView(window.location.hash);
  }
  learnjs.showView(window.location.hash);
};

