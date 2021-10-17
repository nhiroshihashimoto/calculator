(( window, document )=>{
    'use strict';

    var $visor = document.querySelector('[data-js="visor1"]');
    var $visor2 = document.querySelector('[data-js="visor2"]');
    var $visor3 = document.querySelector('[data-js="visor3"]');
    var $buttonsNumbers = document.querySelectorAll('[data-js="number"]');
    var $buttonBack = document.querySelector('[data-js="back"]');
    var $buttonCE = document.querySelector('[data-js="ce"]');
    var $buttonOperations = document.querySelectorAll('[data-js="operation"]');
    var $buttonOParentheses = document.querySelector('[data-js="oParentheses"]');
    var $buttonCParentheses = document.querySelector('[data-js="cParentheses"]');
    var $buttonComma = document.querySelector('[data-js="comma"]');
    var $buttonInvert = document.querySelector('[data-js="invert"]');
    var $buttonEqual = document.querySelector('[data-js="equal"]');
    var parentheses = 0;

    $visor2.addEventListener( 'click', handdleClickVisor2, false);
    $visor3.addEventListener( 'click', handdleClickVisor3, false);

    Array.prototype.forEach.call( $buttonsNumbers, ( button ) => {
        button.addEventListener( 'click', handleClickNumber, false );
    });

    Array.prototype.forEach.call( $buttonOperations, ( button ) => {
        button.addEventListener( 'click', handleClickOperation, false );
    });

    $buttonCE.addEventListener( 'click', handleClickCE, false );
    $buttonBack.addEventListener( 'click', handleClickBack, false);

    $buttonOParentheses.addEventListener( 'click', handleClickOParentheses, false );
    $buttonCParentheses.addEventListener( 'click', handleClickCParentheses, false );
    $buttonComma.addEventListener( 'click', handleClickComma, false );
    $buttonInvert.addEventListener( 'click', handleClickInvert, false );
    $buttonEqual.addEventListener( 'click', handleClickEqual, false );

    // Test
    //$visor.value = '23x2';
    //$visor2.value = '42x(23+23)+23x2';
    //$visor3.value = '42+23x2';

    function handdleClickVisor2(){
        if( !visorIsClear($visor2) ){
            $visor.value = $visor2.value;
            $visor2.value = $visor3.value;
            $visor3.value = '';
        }
    }

    function handdleClickVisor3(){
        if( !visorIsClear($visor3) ){
            $visor.value = $visor3.value;
            $visor2.value = '';
            $visor3.value = '';
        }
    }

    function handleClickNumber(){
        if( $visor.value === '0' ){
            $visor.value = this.value;
            return;
        }
        $visor.value += this.value;
    }
    function handleClickOperation(){
        if( lastItemIsAnOperator() )
            deleteLastItem();
        if( !$visor.value.match(/[\(\,]$/g) )
            $visor.value += this.value;
    }

    function handleClickCE(){
        $visor.value = 0;
        parenthesesCount();
    }

    function handleClickBack(){
        deleteLastItem();
    }

    function handleClickOParentheses(){
        if( $visor.value === '0' ){
            $visor.value = $buttonOParentheses.value;
        }
        if( lastItemIsAnOperation() ){
            $visor.value += $buttonOParentheses.value;
        }
        parenthesesCount();
    }

    function handleClickCParentheses(){
        if(parentheses > 0 && haveOperation() ){
            $visor.value += $buttonCParentheses.value;
        }
        parenthesesCount();
    }

    function handleClickComma(){
        if( !$visor.value.match(/(?:[+−x÷\-()])$|(?:\d+,)$|(?:\d+,\d+)$|,$/g)){
            $visor.value += $buttonComma.value;
        }
    }

    function handleClickInvert(){
        if( lastItemIsAnComma() )
            deleteLastItem();
        if( lastItemIsAnNumber() ){
            changeCommaToPoint();
            $visor.value = $visor.value.replace( /(\-?(?:\d+)?\.?\d+)$/,
            ( match1 )=>{ return (-match1); });
            changePointToComma();
        }
    }

    function handleClickEqual(){
        if( !lastItemIsAnOperator() && !lastItemIsAnOParentheses() && parentheses == 0 && !$visor.value.match(/^\d+$/g) ){
            $visor3.value = $visor2.value;
            $visor2.value = $visor.value;
            changeCommaToPoint();
            var arr = $visor.value.split('');
            haveEquation(arr);
        }
    }

    function visorIsClear(visor){
        if(visor.value === ''){
            return true;
        }
        return false;
    }

    function parenthesesCount(){
        parentheses = 0;
        for(var i = 0; i < $visor.value.length; i++){
            if( $visor.value.charAt(i) === '(' ){
                parentheses++
            } else if( $visor.value.charAt(i) === ')' ){
                parentheses--;
            }
        }
        updateButtonOParentheses();
    }

    function changeCommaToPoint(){
        $visor.value = $visor.value.replace( /(\.)/g, '' );
        $visor.value = $visor.value.replace( /(,)/g, '\.' );
    }

    function changePointToComma(){
        $visor.value = $visor.value.replace( /(\.)/g, ',' );
    }

    function updateButtonOParentheses(){
        $buttonOParentheses.innerHTML = '(' + parentheses;
        if( parentheses < 1)
            $buttonOParentheses.innerHTML = '(';
    }

    function deleteLastItem(){
        $visor.value = $visor.value.slice( 0, -1 );
        if($visor.value === '')
            $visor.value = 0;
        parenthesesCount();
    }


    function haveOperation(){
        if( $visor.value.match(/\d+[+−x÷\-]+\d+(?:,?\d+)?$/g) )
            return true;
        return false;
    }

    function lastItemIsAnOperator(){
        if( $visor.value.match(/[+−x÷\-]+$/g) )
            return true;
        return false;
    }

    function lastItemIsAnOParentheses(){
        if( $visor.value.match(/\($/g) )
            return true;
        return false;
    }

    function lastItemIsAnComma(){
        if( $visor.value.match(/,$/g) )
            return true;
        return false;
    }

    function lastItemIsAnOperation(){
        if( $visor.value.match(/(?:\d+|\))[+−x÷\-]+$/g) )
            return true;
        return false;
    }

    function lastItemIsAnNumber(){
        if( $visor.value.match(/\d+$/g) )
            return true;
        return false;
    }

    function haveEquation(arr){
        if( haveParentheses(arr) ){
            resolveParentheses(arr);
            haveEquation(arr);
        }
        if( haveMult(arr) ){
            resolveMulti(arr);
            haveEquation(arr);
        }
        if( havePlus(arr) ){
            resolvePlus(arr);
            haveEquation(arr);
        }

        changePointToComma();
        $visor.value = arr.join('');
        changePointToComma();
        return arr;
    }

    function resolveParentheses(arr){
        if( arr.some((item)=>{return item === '('})){
            var lastOParentheses = 0;
            var firstCParentheses;
            for(var i = 0; i < arr.length; i++){
                if(arr[i] ==='('){
                    lastOParentheses = i;
                }
            }
            for(var i = arr.length; i >= 0; i--){
                if(arr[i] ===')'){
                    firstCParentheses = i;
                    break;
                }
            }

            var inside = cutArray(arr, lastOParentheses, (firstCParentheses - lastOParentheses + 1));
            var result = haveEquation(inside);
            arr.splice(lastOParentheses, 0, result.join(''));

            if( !haveParentheses(arr) ){
                haveEquation(arr);
            }
        }
    }

    function resolveMulti(arr){
        var operatorPosition;
        var operator;
        var startPoint = '';
        var endPoint = '';

        operatorPosition = searchOperatorMulti(arr);
        operator = arr[operatorPosition];

        var firstNumber = firstNumbersOfEquation(arr, operatorPosition);
        startPoint = getStartPoint(arr, operatorPosition);
        
        var secondNumber = secondNumbersOfEquation(arr, operatorPosition);
        endPoint = (getEndPoint(arr, operatorPosition) - startPoint);

        var calc = calculator[operator](firstNumber,secondNumber);
        var value = Array.from(String(calc), String);
        putArray( arr, value, startPoint, endPoint + 1 );
    }

    
    function resolvePlus(arr){
        var operatorPosition;
        var operator;
        var startPoint = '';
        var endPoint = '';

        operatorPosition = searchOperatorPlus(arr);
        operator = arr[operatorPosition];

        var firstNumber = firstNumbersOfEquation(arr, operatorPosition);
        startPoint = getStartPoint(arr, operatorPosition);
        
        var secondNumber = secondNumbersOfEquation(arr, operatorPosition);
        endPoint = (getEndPoint(arr, operatorPosition) - startPoint);

        var calc = calculator[operator](firstNumber,secondNumber);
        var value = Array.from(String(calc), String);
        putArray( arr, value, startPoint, endPoint + 1 );
    }

    function searchOperatorMulti(arr){
        for(var i = 0; i < arr.length; i++){
            if(arr[i].match(/[x÷]/g)){
                return i;
            }
        }
    }

    function searchOperatorPlus(arr){
        for(var i = 0; i < arr.length; i++){
            if(arr[i].match(/[+−]/g)){
                return i;
            }
        }
    }

    function firstNumbersOfEquation(arr, operatorPosition){
        var firstNumber = '';
        for(var i = (operatorPosition - 1); i >= 0; i--){
            if( isNumber(arr[i]) ){
                var temp = firstNumber;
                firstNumber = arr[i] + temp;
            } else{
                break;
            }
        }
        return firstNumber;
    }

    function secondNumbersOfEquation(arr, operatorPosition){
        var secondNumber = '';
        for(var i = ++operatorPosition; i < arr.length; i++){
            if( isNumber(arr[i]) ){
                secondNumber+= arr[i];
            } else{
                break;
            }
        }
        return secondNumber;
    }

    function getStartPoint(arr, operatorPosition){
        var startPoint = '';
        for(var i = (operatorPosition - 1); i >= 0; i--){
            if( isNumber(arr[i]) ){
                startPoint = i;
            } else{
                break;
            }
        }
        return startPoint;
    }

    function getEndPoint(arr, operatorPosition){
        var endPoint = '';
        for(var i = ++operatorPosition; i < arr.length; i++){
            if( isNumber(arr[i]) ){
                endPoint = i;
            } else{
                break;
            }
        }
        return endPoint;
    }

    function isNumber(prop){
        var rx = /[\-\d\.]/g;
        var test = rx.test(prop);
        return test;
    }

    function haveMult(arr){
        var rx = /[x÷]/g;
        var some = arr.some(item=>rx.test(item));
        return some;
    }

    function havePlus(arr){
        var rx = /[+−]/g;
        var some = arr.some(item=>rx.test(item));
        return some;
    }

    function haveParentheses(arr){
        var rx = /[\(]/g;
        var some = arr.some(item=>rx.test(item));
        return some;
    }

    function cutArray( mainArr, start, toCut){
        var newArr;
        newArr = mainArr.splice(start, toCut);
        newArr.shift();
        newArr.pop();
        return newArr;
    }

    function putArray( mainArr, value, start, toCut ){
        cutArray( mainArr, start, toCut );
        mainArr.splice( start, 0, ...value );
    }

    const calculator = {
        '+' : function( x, y ){ return +x + +y },
        '−' : function( x, y ){ return +x - +y },
        'x' : function( x, y ){ return x * y },
        '÷' : function( x, y ){ return x / y }
    }



    const keyButton = {
        '1' : ()=>{ return numClick(6) },
        '2' : ()=>{ return numClick(7) },
        '3' : ()=>{ return numClick(8) },
        '4' : ()=>{ return numClick(3) },
        '5' : ()=>{ return numClick(4) },
        '6' : ()=>{ return numClick(5) },
        '7' : ()=>{ return numClick(0) },
        '8' : ()=>{ return numClick(1) },
        '9' : ()=>{ return numClick(2) },
        '0' : ()=>{ return numClick(9) },
        '-' : ()=>{ return opClick(2) },
        '+' : ()=>{ return opClick(3) },
        '*' : ()=>{ return opClick(1) },
        'x' : ()=>{ return opClick(1) },
        '/' : ()=>{ return opClick(0) },
        'Enter' : ()=>{ 
            activeCSS($buttonEqual);
            return $buttonEqual.click() },
        '=' : ()=>{ 
            activeCSS($buttonEqual);
            return $buttonEqual.click() },
        'Backspace' : ()=>{ 
            activeCSS($buttonEqual);
            return $buttonBack.click() },
        '(' : ()=>{ 
            activeCSS($buttonOParentheses);
            return $buttonOParentheses.click() },
        ')' : ()=>{ 
            activeCSS($buttonCParentheses);
            return $buttonCParentheses.click() },
        'ArrowUp' : ()=>{ 
            activeCSS($buttonInvert);
            return $buttonInvert.click() },
        'ArrowDown' : ()=>{ 
            activeCSS($buttonInvert);
            return $buttonInvert.click() },
        'Delete' : ()=>{ 
            activeCSS($buttonCE);
            return $buttonCE.click() },
        ',' : ()=>{ 
            activeCSS($buttonComma);
            return $buttonComma.click() },
        '.' : ()=>{ 
            activeCSS($buttonComma);
            return $buttonComma.click() }
    }

    function numClick(num){
        $buttonsNumbers[num].click();
        activeCSS($buttonsNumbers[num]);
    }

    function opClick(button){
        $buttonOperations[button].click();
        activeCSS($buttonOperations[button]);
    }

    function activeCSS(button){
        clearTimeout(temp);
        button.className = 'keybuttonActive';
        if(button.value === '=' || button.value === 'Enter'){
            button.className = 'keyequalActive';
        }
        var temp = setTimeout(() => {
            button.className = '';
            if(button.value === '=' || button.value === 'Enter'){
                button.className = 'equal';
            }
        }, 100);
    }
    
    window.addEventListener('keydown', function (e){
        var calc;
        if(keyButton[e.key]){
            calc = keyButton[e.key]();
        }
    },true);

})( window, document );