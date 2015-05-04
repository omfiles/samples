
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



    /////////////////////////////////////////////////////////////////////
    //GLOBAL VARIABLES
    //
    //
    //
    /////////////////////////////////////////////////////////////////////

    var anim_duration=300;
    var home_button=".back-home";
    var main_content='.main-content-col';
    var menu_element='.main-menu-link-block';
    var content_block='.main-content-wrap';
    var main_content_selector='.main-content-box';
    var accordion_wrap='.accordion-wrap';
    var back_overlay='.background-overlay';
    var back_overlay_wrap='.background-overlay-wrap';
    var page_heading_wrap='.main-section-heading-wrapper';
    var page_heading='.main-section-heading';
    var menu_highlight='.main-menu-highlight';
    var menu_block='.main-menu-col';
    var mobile_menu_button='.mobile-menu-toggle';
    var lightbox_button='.open-lightbox';
    
    var num_galleries=13; //Maximum number of galleries in content -1 ** When Adding new galleries - increase this number
    var num_slides=5;

    var lightbox_content_block='.lightbox-wrap';
    var lightbox_content='.lightbox-content';
    var lightbox_content_wrap='.lightbox-content-wrap';
    var lightbox_close_button='.lightbox-close-button';
    var print_button='.print-button';

    var skip_video=".skip-video-button";
    var video_container=".main-video-wrapper";
    var video_controls=".video-controls-box";

    var header_countdown_clock='.header-countdown';
    var big_countdown_clock='.home-page-countdown-digits';

    var active_color='#FFFFFF';
    var inactive_color='#a3cdf1';

    var default_menu_color='#a3cdf1';
    //detect mobile
    var mobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) ? true : false;

    var very_slow=900;

    var loading=false;
    var loader_wrap='.loader-wrap';

    var currentSlide=0;


/////////////////////////////////////////////////////////////////////
//
// Retrieve variable parameters from url string
//
////////////////////////////////////////////////////////////////////

function getUrlVar(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}    

/////////////////////////////////////////////////////////////////////
//
// Resets position of various UI elements, must be called on load
//
////////////////////////////////////////////////////////////////////
function resetStuff(){

    $(main_content).hide();

    //hide menu highlight
    $(menu_highlight).fadeOut();

    $('[class*="rollover"]').hide();
}



/////////////////////////////////////////////////////////////////////
//
// Sets up countdown clock
//
////////////////////////////////////////////////////////////////////

function doCountdown(where,legend){
    $(where).countdown('2014/12/19 23:59:59', function(event) {
     if (legend) {
         var $this = $(this).html(event.strftime(''

           + ' <span>%D</span>d :'
           + ' <span>%H</span>h :'
           + ' <span>%M</span>m :'
           + ' <span>%S</span>s'));

     }else {
        var $this = $(this).html(event.strftime(''
           + ' <span class="countdown-digits-box">%D</span>'+'<span class="light-blue"> : </span>'
           + ' <span class="countdown-digits-box">%H</span>'+'<span class="light-blue"> : </span>'
           + ' <span class="countdown-digits-box">%M</span> '+ '<span class="light-blue"> : </span>'
           + ' <span class="countdown-digits-box">%S</span>'));

    }
});
    
}


/////////////////////////////////////////////////////////////////////
//
// Displays intro video box
//
////////////////////////////////////////////////////////////////////

function doVideo(what,where) {


//ensures video is only loaded on first load
//whenver home button is clicked the video and loader are skipped
//    
if (getUrlVar('skip-video')==1 || mobile) {
    $(loader_wrap).fadeOut(1,function(){
        $(main_content).fadeIn('fast', function(){ 
            $(back_overlay_wrap).fadeIn(very_slow);});
    });
    return;
}

$(loader_wrap).delay(3000).fadeOut(very_slow, function(){

        //hides video when it's finished
        function _onFinish(){
            $(skip_video).trigger('click');
        }

        //initialize full-screen background video using OkVideo plugin
        $.okvideo({ source: '111876354', 
            controls:true,
            loop:0,
            volume:50,
            onPlay:function(){
                        //grab iframe when video is loaded and playing
                        var iframe = $('#okplayer')[0];
                        var player=$f(iframe);
                         //bind finish even to function
                         player.addEvent('finish', _onFinish); 
                     }

                 });
        
        $(video_controls).fadeIn(very_slow);
        
        $(skip_video).click(function(){
            var iframe = $('#okplayer')[0];
            player=$f(iframe);
            player.api('pause');

            $('#okplayer').fadeOut(very_slow);
            
            $(main_content).fadeIn(very_slow, function(){ $(back_overlay_wrap).fadeIn(very_slow);});

            $(video_controls).fadeOut('fast');
        });
    });
}

/////////////////////////////////////////////////////////////////////
//
//
// Bunch of helper functions to handle UI elements on content pages
// must be loaded after the actual content is in place
//
/////////////////////////////////////////////////////////////////////
function pageUI() {


    ///////////////////////////////////////////////////////////////////
    //Handles Accordion Functions
    ///////////////////////////////////////////////////////////////////
    function _accordionHandler(where) {
        //close all tabs
        $('[class*="accordion-text"]').slideUp(0);
        $('[class*="arrow-open"]').hide();
        $('[class*="arrow-closed"]').show();
        header= $(where).find('[class*="heading-wrap"]');
        where=$(where);


        header.click(function(){

            //toggle arrow
            arrow_open=$(this).find('[class*="arrow-open"]');
            arrow_closed=$(this).find('[class*="arrow-closed"]');
            header_text=$(this).find('[class*="text"]');

            if(arrow_open.is(':visible')){
                arrow_open.hide();
                arrow_closed.show();
                header_text.css({
                    'color': inactive_color,
                });
            } else {
                arrow_open.show();
                header_text.css({
                    'color': active_color,
                });
                arrow_closed.hide();
            }
            
            $(this).next('[class*="accordion-text"]').slideToggle('fast');

            //close all others and toggle their arrows except this one
            where.find('[class*="accordion-text"]').not($(this).next()).slideUp();
            where.find('[class*="arrow-open"]').not(arrow_open).hide();
            where.find('[class*="arrow-closed"]').not(arrow_closed).show();
            where.find('[class*="text"]').not(header_text).css({'color': inactive_color});
        });
}

        /////////////////////////////////////////////////////////////////////
        // Loads content into "lightbox" elements
        /////////////////////////////////////////////////////////////////////
        function _doLightBox(what,where,selector){

            //hardcoded support for seating map lightbox button
            $('.seating-map-link').click(function(){
                $('.seating-map-large').fadeIn('slow');
            });

            $('.seating-map-large').click(function(){$(this).fadeOut('slow');});

            $(what).click(function(e){
                e.preventDefault();
                link=$(this).attr("href");
                $(where).load(link+' '+selector,function(){

                     //bind close button
                     $(lightbox_close_button).click(function(event) {
                        $(lightbox_content_block).fadeOut("slow");
                    });
                 }).hide().fadeIn('slow',function(){ _doPrintButton(print_button);}); //bind print button after lightbox content loaded
            });
        }

        /////////////////////////////////////////////////////////////////////
        // Implements and binds print functionality
        /////////////////////////////////////////////////////////////////////
        function _doPrintButton(what) {

            var css_path=['http://royals.brochure-mlb.com/2015/css/normalize.css','http://royals.brochure-mlb.com/2015/css/c1ms.css','http://royals.brochure-mlb.com/2015/css/royals.c1ms.css'];

            content=$(what).parent();
            $(what).click(function (e) {


                e.preventDefault();
                content.printThis({
                  debug: false,               
                  importCSS: true,            
                  importStyle: false,         
                  printContainer: false,      
                  loadCSS: css_path,
                  pageTitle: "",             
                  removeInline: false,       
                  printDelay: 333,           
                  header: null,              
                  formValues: true            
              });

            })
        }

      


_accordionHandler(accordion_wrap);
_doLightBox(lightbox_button,lightbox_content_block,main_content_selector);
}


/////////////////////////////////////////////////////////////////////
//
//Binds the gallery plugin to images of class "gallery"
//
/////////////////////////////////////////////////////////////////////
        function doGallery() {


            for (i=1;i<num_galleries;i++) {
                $('.gallery'+i).featherlightGallery({
                    gallery: {
                        fadeIn: 600,
                        fadeOut: 100
                    },
                    previousIcon: '&#10094;',     /* Code that is used as previous icon */
                    nextIcon: '&#10095;', 
                    openSpeed:    300,
                    closeSpeed:   300,
                    variant: 'featherlight-gallery'+i
                });
            }
        }



/////////////////////////////////////////////////////////////////////
//
//On clicking 'what' loads the contents of clicked href in 'where'
//
//
/////////////////////////////////////////////////////////////////////
function menuRouter(what,where,selector) {
    $(what).click(function(e){
        e.preventDefault();
        link=$(this).attr("href");
        if (loading) return; //ignore click if another page is loading
        loadig=true;
        $(where).load(link+' '+selector, function(){
            pageUI();
            //set page heading
            $(page_heading_wrap).load(link+' '+page_heading).hide().fadeIn(very_slow);
            //when content loaded - load background overlay
            $(back_overlay_wrap).load(link+' '+back_overlay).hide().fadeIn(very_slow);
            
            //on success process the ui elements
            
            //requires to refresh the slider if slider is used-->
            loading=false;
        }).hide().fadeIn(very_slow,function(){ afterContentLoaded();}); //call gallery after content loaded
        
    });
}

/////////////////////////////////////////////////////////////////////
//
//Applies whatever DOM manipulation is necessary to content loaded 
// by menu
//
/////////////////////////////////////////////////////////////////////

function afterContentLoaded() {
    c1ms.require('slider').redraw(); 
    doGallery();
    doOmniture();
    trackSlider();

}

/////////////////////////////////////////////////////////////////////
//
// Tracks currently active slide in Schedule
// for Omniture
//
/////////////////////////////////////////////////////////////////////

function trackSlider(){
    var links=new Array("April","May","June","July","August","September/October");

    $('.slider-right-wrap').click(

        function(){
            
            currentSlide++;
            if (currentSlide>num_slides){
                currentSlide=0;
            }
            doOmniTrack(links[currentSlide]);
        });
    
    $('.slider-left-arrow-wrap').click(
        
        function(){
            
            currentSlide--;
            if (currentSlide<0){
                currentSlide=num_slides;
            }
            doOmniTrack(links[currentSlide]);
        });
}

/////////////////////////////////////////////////////////////////////
//
// Handles various menu effects, like hover and animation
//
/////////////////////////////////////////////////////////////////////
function menuUi(what) {
    var text="";
    var icon;
    var icon_over;
    
    //helper function to find the text and icons inside menu blocks
    //and cache the found objects
    function _findSelectors(o) {
        text=o.find('[class*="text"]');
        icon=o.find('[class*="default-pic"]');
        icon_over=o.find('[class*="rollover"]');
        other_elements=$(menu_element).not($(o));
    }

    //show/hide menu on mobile sandwich button click
    $(mobile_menu_button).click(function(e){
       $(menu_block).slideToggle('fast');
   });
    
    //Hover fx
    if (!mobile) {
        $(what).hover(
            //mouse in
            function(){
                _findSelectors($(this));
                text.css('color',active_color);
                $(icon).hide();
                $(icon_over).css('display', 'inline-block');
            }, 
            //mouse out
            function(){

                if($(this).data('active')!='true'){
                  _findSelectors($(this));
                  text.css('color',default_menu_color);
                  $(icon).css('display', 'inline-block');
                  $(icon_over).hide();
              }

              
              
          } 
          );
    }

    //menu click interactions
    $(what).click(function(e){

        //cache looked up selectors in local variables
        _findSelectors($(this));
        
        //set active flag -- curently not used
        $(this).data('active', 'true');
        other_elements.data('active','false');
        
        //get current item's position relative to parent container
        //get current item's height so the highlight is properly sized
        current_item_y=$(this).position().top;
        current_item_h=$(this).height();
        extra_padding=5; //some extra padding for the highlight

        //change text to active color when clicked
        $(this).find('[class*="text"]').attr('style', 'color:'+active_color);
        
        //reset all other menu items to default color
        other_elements.find('[class*="text"]').attr('style', 'color:'+default_menu_color);
        
        //change icon to rollover
        $(icon).hide();
        $(icon_over).css('display', 'inline-block');
        
        //hide rollover on previously active item and display regular icon
        other_elements.find('[class*="rollover"]').hide();
        other_elements.not($(this)).find('[class*="default-pic"]').css('display', 'inline-block');
        
        //animate moving of the highlight
        $(menu_highlight).fadeIn().animate({ 
            top: current_item_y,
            height:current_item_h+extra_padding,
        }, anim_duration, function(){

            if (mobile) $(menu_block).slideToggle('fast');
        });
    });

}


/////////////////////////////////////////////////////////////////////
//
//Reloads page without video on clicking home button
//
/////////////////////////////////////////////////////////////////////
function doHomeButton() {

    $(home_button).click(function(){

        if (getUrlVar('skip-video')==1 ) {
            location.reload();
        }else {
            link=window.location.href+'?skip-video=1';
            window.location=link;
        }
    });
}


/////////////////////////////////////////////////////////////////////
//
//handles omniture tracking on sub-pages and other anchors
//
/////////////////////////////////////////////////////////////////////
function doOmniture() {
    $('.link').each(function(index){
        i=$(this);
        i.click(function(){
            doOmniTrack($(this).text().trim());
        });
    });
}

/////////////////////////////////////////////////////////////////////
//******************************************************************
//
// MAIN()
//
//******************************************************************
/////////////////////////////////////////////////////////////////////

$(function() {


    $(back_overlay_wrap).hide();
    //display video after loader wrap


    doVideo();
    

    //reset whatever needes to be reset
    resetStuff();

    
    //route all clicks on main menu to open content in main content area
    menuRouter(menu_element,content_block,main_content_selector);
    
    //bind click and hover fx to main menu
    menuUi(menu_element);

    //bind page UI elements
    pageUI();
    
    doCountdown(header_countdown_clock,true);
    doCountdown(big_countdown_clock,false);

    //binds go home to logo button
    doHomeButton();

    doOmniture();



    
});
