////////////////////////////////
// 2 variables to set //////////
var submit_id = '';
var textbox_id = '';
////////////////////////////////

// Position utils
function getPosition(elt) {
    var element = elt;
    var left = element.offsetLeft;
    var top  = element.offsetTop;
    while (element = element.offsetParent)
        left += element.offsetLeft;
    element = elt;
    while (element = element.offsetParent)
        top  += element.offsetTop;
    return [left, top];
}
function setPosition(elt, left ,top) {
    s = elt.style;
    s.left = left + "px";
    s.top  = top  + "px";
}
function enable(elt) {
    s = elt.style;
    s.position = "absolute";
    s.display  = "inline";
}

// Movement utils
function moveToOneStep(elt, startLeft, startTop, endLeft, endTop) {
    if (endLeft - startLeft > endTop - startTop) {
        setPosition(elt, getPosition(elt)[0] + 1, ((endTop-startTop)/(endLeft-startLeft))*(getPosition(elt)[0]+1-startLeft)+startTop);
    } else {
        setPosition(elt, ((endLeft-startLeft)/(endTop-startTop))*(getPosition(elt)[1]+1-startTop)+startLeft, getPosition(elt)[1]+1);
    }
}

// Text utils
function appendText(elt, text) {
    elt.focused = true;
    elt.value += text;
}
function setText(elt, text) {
    elt.innerHTML = text;
}

// Main functions
function moveToOneStepHighLevel(left, top) {
    if (getPosition(lmdtfy_fakemouse)[0] < left) {
        moveToOneStep(lmdtfy_fakemouse, 0, 0, left, top);
    } else {
        clearInterval(moving);
        setPosition(lmdtfy_textbox,
                    (getPosition(target_submit)[0]+getPosition(target_textbox)[0])/2,
                    (getPosition(target_submit)[1]+getPosition(target_textbox)[1])/2);
        setText(lmdtfy_textbox, "Was it difficult ?");
        setTimeout(function() { target_submit.click() }, 1500);
    }
}
function writeTextOneByOne(text) {
    var length = target_textbox.value.length;
    appendText(target_textbox, text.charAt(length));
    if (length == text.length) {
        clearInterval(writing);
        lmdtfy_fakemouse.style.display = 'inline';
        setPosition(lmdtfy_fakemouse, 0, 0);
        setPosition(lmdtfy_textbox,
                    getPosition(target_submit)[0]+target_submit.offsetWidth,
                    getPosition(target_submit)[1]+target_submit.offsetHeight);
        if (target_submit.value == "") {
            setText(lmdtfy_textbox, "2. Click on the search button");
        } else {
            setText(lmdtfy_textbox, "2. Click on "+target_submit.value);
        }
        var left = getPosition(target_submit)[0]+target_submit.offsetWidth/2;
        var top  = getPosition(target_submit)[1]+target_submit.offsetHeight/2;
        moving = self.setInterval(function() {
                                       moveToOneStepHighLevel(left, top)
                                  }, 1000/Math.max(left, top));
    }
}
function lmdtfy(text) {
    lmdtfy_textbox = document.createElement('div');
    lmdtfy_textbox.style.backgroundColor = 'rgb(230, 100, 20)';
    lmdtfy_textbox.style.color = 'rgb(180, 200, 255)';
    lmdtfy_textbox.style.padding = '10px 10px 10px 10px';
    lmdtfy_textbox.style.position = 'absolute';
    lmdtfy_textbox.style.display = 'inline';
    lmdtfy_textbox.style.zIndex = '99999';
    lmdtfy_fakemouse = document.createElement('img');
    lmdtfy_fakemouse.setAttribute('src', 'http://lmgtfy.com/images/mouse_arrow_windows_aero.png');
    lmdtfy_fakemouse.style.position = 'absolute';
    lmdtfy_fakemouse.style.display = 'none';
    lmdtfy_fakemouse.style.zIndex = '100000';
    body = document.getElementsByTagName('body').item(0);
    body.appendChild(lmdtfy_textbox);
    body.appendChild(lmdtfy_fakemouse);
    setPosition(lmdtfy_textbox,
                getPosition(target_textbox)[0]+target_textbox.offsetWidth,
                getPosition(target_textbox)[1]+target_textbox.offsetHeight);
    setText(lmdtfy_textbox, "1. Type your search");
    target_textbox.value = "";
    writing = self.setInterval(function() {
                                   writeTextOneByOne(text)
                               }, 2000/text.length);
}

// Global elements
target_submit = document.getElementById(submit_id);
target_textbox = document.getElementById(textbox_id);
getValues = top.location.href.split('?');
getValues = getValues[1].split('&');
for (i = 0; i < getValues.length; ++i) {
    getValue = getValues[i].split('=');
    if (getValue[0] == "lmdtfy") {
        lmdtfy(getValue[1]);
    }
}
