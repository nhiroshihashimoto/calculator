((window,document)=>{
    //----------------- Gambiarra -----------------

    var $visor1 =  document.getElementsByClassName('visor1');
    var $visor2 =  document.getElementsByClassName('visor2');
    var $visor3 =  document.getElementsByClassName('visor3');

    var visor1Size = +window.getComputedStyle($visor1[0]).fontSize.replace(/px|%$/g, '');
    var visor2Size = +window.getComputedStyle($visor2[0]).fontSize.replace(/px|%$/g, '');
    var visor3Size = +window.getComputedStyle($visor3[0]).fontSize.replace(/px|%$/g, '');
    var maxSize1 = visor1Size;
    var maxSize2 = visor2Size;
    var maxSize3 = visor3Size;


    function ifHigher(v,visor,size){
        let span = document.createElement('span');
        span.innerHTML = visor.value;
        span.style.fontSize = size * 1.29 + 'px';
        span.style.width = 'auto';
        span.style.display = 'inline-block';
        span.style.visibility = 'hidden';
        span.style.position = 'fixed';
        span.style.overflow = 'auto';
        document.body.append(span);


        if( span.clientWidth >= visor.clientWidth ){
            fontDecrease(visor,size);
        }

        if(span.clientWidth < visor.clientWidth && span.clientWidth < visor.clientWidth * 0.95){
            fontIncrease(v,visor,size);
        }

        span.remove();
    }

    function fontDecrease(visor,size){
        visor.style.fontSize = (size - 0.4) + 'px';
        updateVisor();
    }

    function fontIncrease(v,visor,size){
        if(size < maxSize1 && v == 1){
            visor.style.fontSize = (size + 0.4) + 'px';
            updateVisor();
        }
        if(size < maxSize2 && v == 2){
            visor.style.fontSize = (size + 0.4) + 'px';
            updateVisor();
        }
        if(size < maxSize3 && v == 3){
            visor.style.fontSize = (size + 0.4) + 'px';
            updateVisor();
        }
    }

    function updateVisor(){
        visor1Size = +window.getComputedStyle($visor1[0]).fontSize.replace(/px|%$/g, '');
        visor2Size = +window.getComputedStyle($visor2[0]).fontSize.replace(/px|%$/g, '');
        visor3Size = +window.getComputedStyle($visor3[0]).fontSize.replace(/px|%$/g, '');
    }

    function init(){
        
        ifHigher(1,$visor1[0],visor1Size);
        ifHigher(2,$visor2[0],visor2Size);
        ifHigher(3,$visor3[0],visor3Size);
        
        setTimeout(init, 10);
    }
    init();

})(window,document);