
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
  var plantTableInDashboard = document.querySelectorAll('.tw-text-center');
  
  var activeMenuAppend = document.getElementById('activeElementId') 
                            ? document.getElementById('activeElementId').innerText
                            : getActiveMenu();

  if (plantTable && plantTable.length > 0 && activeMenuAppend === 'Marketplace') {
    // in market place
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
      const harvestDays = Number(onlyHour) / 24;
      nodeLEPerHourDiv.innerText = lePerHour.toFixed(2) + '/Hour' + ' in '+ harvestDays + ' day(s)';
      const nodePvuByMonthDiv = nodeLEPerHourDiv.cloneNode(true);
      nodePvuByMonthDiv.id = 'pvu-m' + plantId;

      const pvuByMonth = calculatePvuByMonth(lePerHour);
      nodePvuByMonthDiv.innerText = pvuByMonth.toFixed(2) + ' pvu by month';

      if (lePerHour >= 9) {
        nodeLEPerHourDiv.style.cssText += applyGoodPriceStyle();
      } else {
        nodeLEPerHourDiv.style.cssText += applyBadPriceStyle(lePerHour);
      }
      
      
      if (!document.getElementById('pvu-' + plantId)) {
        insertAfter(nodeLEPerHourDiv, plantTable[i]);
      }
    }
  }


  if (plantTableInDashboard && plantTableInDashboard.length > 0 && activeMenuAppend === 'Dashboard') {

    for (var x=0, maxDashboard=plantTableInDashboard.length; x < maxDashboard; x++) {
        let leHourFull = plantTableInDashboard[x].innerText;
        let leduplicatedDiv = plantTableInDashboard[x].cloneNode(true);
        
        if (plantTableInDashboard[x].id) {
          // skip it
          continue;
        }
        leHourFull = leHourFull.replace('LE:', '').replace('Hour', '');
        const onlyLE = leHourFull.split('/')[0];
        const onlyHour = leHourFull.split('/')[1];
        let lePerHour = (Number(onlyLE) / Number(onlyHour)).toFixed(2);
        lePerHour = lePerHour - (lePerHour *0.05); // apply 5% tax

        const plantId = plantTableInDashboard[x]
                        .parentElement
                        .parentElement
                        .parentElement
                        .getAttribute('href').replace('#/plant/', '');

        leduplicatedDiv.id = 'pvu-' + plantId;
        const harvestDays = Number(onlyHour) / 24;
        leduplicatedDiv.innerText = lePerHour.toFixed(2) + '/Hour' + ' in '+ harvestDays + ' day(s)';

        if (lePerHour >= 9) {
          leduplicatedDiv.style.cssText += applyGoodPriceStyle();
        } else {
          leduplicatedDiv.style.cssText += applyBadPriceStyle(lePerHour);
        }
        
        
        if (!document.getElementById('pvu-' + plantId)) {
          insertAfterInDashboard(leduplicatedDiv, plantTableInDashboard[x]);
        }
    }
  }
}, 1500);


function getActiveMenu() {
    var newElementInDom = document.createElement('div');
    newElementInDom.id = 'activeElementId';
    newElementInDom.innerText = document.querySelector('.nuxt-link-exact-active').innerText;
    document.body.appendChild(newElementInDom);
    return document.querySelector('.nuxt-link-exact-active').innerText;
}

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

function insertAfterInDashboard(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode);
}

  
function removeFromDom() {
  const allTags = document.querySelectorAll('[id^="pvu-"]')
  allTags.forEach(element => {
    element.remove();
  }); 
}
