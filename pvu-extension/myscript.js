

setTimeout(() => {
document.getElementsByClassName('box tw-cursor-pointer')[0]
  .addEventListener('click', function (event) {
      removeFromDom();
  });
  document.getElementsByClassName('box tw-cursor-pointer')[1]
  .addEventListener('click', function (event) {
      removeFromDom();
  });
}, 1500);


setInterval(() => {
  var plantTable = document.getElementsByClassName('tw-flex tw-justify-between tw-items-end');
  if (plantTable && plantTable.length > 0) {
    removeFromDom();

    for (var i=0, max=plantTable.length; i < max; i++) {
      let leHourFull = plantTable[i].firstElementChild.innerText;
      let priceValue = retrievePrice(plantTable[i].lastElementChild.innerText);
      leHourFull = leHourFull.replace('LE:', '').replace('Hour', '');
      const onlyLE = leHourFull.split('/')[0];
      const onlyHour = leHourFull.split('/')[1];
      let lePerHour = (Number(onlyLE) / Number(onlyHour)).toFixed(2);
      lePerHour = lePerHour - (lePerHour *0.05); // apply 5% tax
      const nodeLEPerHourDiv = plantTable[i].firstElementChild.cloneNode(true);
      const plantId = plantTable[i].previousSibling
                                    .previousSibling
                                    .previousSibling
                                    .previousSibling
                                    .firstChild
                                    .firstElementChild
                                    .lastElementChild
                                    .textContent;
      nodeLEPerHourDiv.id = 'pvu-' + plantId;
      nodeLEPerHourDiv.innerText = lePerHour.toFixed(2) + '/Hour';
      const nodePvuByMonthDiv = nodeLEPerHourDiv.cloneNode(true);
      nodePvuByMonthDiv.id = 'pvu-m' + plantId;

      const pvuByMonth = calculatePvuByMonth(lePerHour);
      nodePvuByMonthDiv.innerText = pvuByMonth.toFixed(2) + ' pvu by month';

      if (pvuByMonth >= priceValue) {
        nodeLEPerHourDiv.style.cssText += applyGoodPriceStyle(lePerHour);
        nodePvuByMonthDiv.style.cssText += applyGoodPriceStyle();
      } else {
        nodeLEPerHourDiv.style.cssText += applyBadPriceStyle(lePerHour);
        nodePvuByMonthDiv.style.cssText += applyBadPriceStyle();
      }
      
      
      if (!document.getElementById('pvu-' + plantId)) {
        insertAfter(nodeLEPerHourDiv, plantTable[i]);
      }
    }
  }
}, 1500);

function calculatePvuByMonth(lePerHour) {
  return (lePerHour * 24 * 30) / 150;

}
function retrievePrice(priceValue) {
  return Number(priceValue.split(' ')[0].replace(/\s/g, ""))
}

function applyBadPriceStyle(lePerHour) {
  let color = '#c5162e';
  if (lePerHour >= 6.5 && lePerHour <=9) {
    color = '#b3a717';
  }
  if (lePerHour > 9) {
    color = '#0f9826';
  }

  return 'background-color: '+ color +'; color: white;margin-left: 5px;font-size: 85%;';
}
function applyGoodPriceStyle() {
  return 'background-color: #19aa19; color: white;margin-left: 5px;font-size: 85%;';
}
function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
  
function removeFromDom() {
  const allTags = document.querySelectorAll('[id^="pvu-"]')
  allTags.forEach(element => {
    element.remove();
  }); 
}
