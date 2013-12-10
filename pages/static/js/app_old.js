(function($){

    window.VEvent = Backbone.DeepModel.extend({
	    
        initialize: function() {
            //this.attributes.venn.big = false;
            
            this.set({'friends.big': 'false' });
            this.set({'info.big': 'false' });
            this.set({'buzz.big': 'false' });
            console.log('This model is: ', this);

            //this.set({ 'friends.big': false});
            //this.set({ 'info.big': false});
            //this.attributes.friends.big = false;
            //this.attributes.info.big = false;
            //this.attributes.buzz.big = false;

            //this.attributes.location.visible = false;
        },        
        
        changeVennDiagram: function(type) {

            // If a section is clicked set the corresponding model attribute to true and all others to false
            this.sectionTypes = new Array('venn', 'friends', 'info', 'buzz');

            // Set all other model attributes to false
            for (var i = 0; i < this.sectionTypes.length; i++) {
                this.goSmall = this['goSmall'+this.sectionTypes[i].charAt(0).toUpperCase() + this.sectionTypes[i].slice(1)];
                this.goSmall();
            }

            if (!(type == 'outside')) {

                var removeIndex = this.sectionTypes.indexOf(type);
                this.sectionTypes.splice(removeIndex, 1);
                
                this.goingBig = type + '.big';
            
                this.goBig = this['goBig'+type.charAt(0).toUpperCase() + type.slice(1)];
                this.goBig();
            }

        },

        goBigVenn: function() {
            
            this.set({ 'venn.big': true });

        },

        goSmallVenn: function() {
            
            this.set({ 'venn.big': false });

        },

        goBigFriends: function() {

            this.set({ 'friends.big': true });
            console.log('goBigFriends: ', this.attributes.friends.big);

        },

        goSmallFriends: function() {
            
            this.set({ 'friends.big': false });
            console.log('goSmallFriends: ', this.attributes.friends.big);

        },    

        goBigInfo: function() {

            this.set({ 'info.big': true });
            console.log('goBigInfo: ', this.attributes.info.big);

        },

        goSmallInfo: function() {
            
            this.set({ 'info.big': false });
            console.log('goSmallInfo: ', this.attributes.info.big);

        },    

        goBigBuzz: function() {

            this.set({ 'buzz.big': true });
            console.log('goBigBuzz', this.attributes.buzz.big);

        },

        goSmallBuzz: function() {
            
            this.set({ 'buzz.big': false });
            console.log('goSmallBuzz: ', this.attributes.buzz.big);

        },    

        toggleLocationVisibility: function() {

            if (this.get('location.visible')) {
                this.set({'location.visible':false});
            } else {
                this.set({'location.visible':true}); 
            }

        },

    });	

    window.VEvents = Backbone.Collection.extend({
	    model: VEvent,
	    //url: PAGE_API, 
	    url: "http://www.vennyou.co.uk/api/v1/event/?format=json", 

        parse : function(response){
            console.log('response was %s', response);
            return response.objects;
        },

        test: function() {
            console.log('Hello there');
        },

        maybeFetch: function(options){
            // Helper function to fetch only if this collection has not been fetched before.
            if(this._fetched){
                // If this has already been fetched, call the success, if it exists
                options.success && options.success();
                return;
            }

            // when the original success function completes mark this collection as fetched
            var self = this,
                successWrapper = function(success){
                    return function(){
                        self._fetched = true;
                        success && success.apply(this, arguments);
                    };
                };
            options.success = successWrapper(options.success);
            this.fetch(options);
        },

        getOrFetch: function(id, options){
            // Helper function to use this collection as a cache for models on the server
            var model = this.get(id);
            
            if(model){
                options.success && options.success(model);
                return;
            }
            /*            
            model = new VEvent({
                resource_uri: id
            });

            model.fetch(options);*/
        }

    });
    
    window.eventsList = new VEvents();

    $(document).ready(function() {

        window.VennView = Backbone.View.extend({

            initialize: function() {

                _.bindAll(this, 'render', 'goBig', 'goSmall');

                this.overlay = this.options.overlay;
                this.$images = this.options.images;
                
                this.stageWidth = this.options.canvasWidth;
                this.stageHeight = this.options.canvasHeight;
                
                // Inner stage height for the venn circles is stageWidth * (6 - root(3)/3)/6
                this.innerStageWidth = this.stageWidth;
                this.innerStageHeight = this.stageHeight * 0.903774955
                this.stageMarginTop = this.stageHeight - this.innerStageHeight
                
                this.smallX = this.innerStageWidth * this.circleXProportion;
                this.smallY = this.stageMarginTop + (this.innerStageHeight * this.circleYProportion);

                // Width is one third of canvas * root(2)
                this.divSmallWidth = this.radius * 2 * 0.707;
                this.divSmallMarginLeft = this.divSmallWidth / -2;
   	            
                this.backgroundID = 'venn_background.png';
                this.backgroundImagePath = '/static/img/venn/venn_cut.png';

                this.$backgroundImage = $('<img/>', {
                }).attr({
                    'id':'',
                    'class':'venn-images',
                    'src':this.backgroundImagePath,
                }).css({
                    position: "absolute",
                    top: 0 + "px",
                    left: 0 + "px",
                    width: this.stageWidth + "px",
                    height: this.stageHeight + "px",
                }).appendTo(
                    this.$images
                );
                
                this.render();
                
            },

            goBig: function() {

            },

            goSmall: function() {

            },

            render: function() {
                //this.layer.add(this.circle);
                //this.circle.setZIndex(10);
                //this.circle.moveToTop();
                return this;
            }

        });
            
            

	
        window.VennCircleView = Backbone.View.extend({
            
            initialize: function() {

                _.bindAll(this, 'render', 'changeCircle', 'goBig', 'goSmall', 'goCovered');
                this.type = this.options.type;

                this.$content = this.options.content;
                this.$images = this.options.images;
                this.svg = this.options.svg;
                this.overlay = this.options.overlay;
                
                this.stageWidth = this.options.canvasWidth;
                this.stageHeight = this.options.canvasHeight;
                
                // Inner stage height for the venn circles is stageWidth * (6 - root(3)/3)/6
                this.innerStageWidth = this.stageWidth;
                this.innerStageHeight = this.stageHeight * 0.903774955
                this.stageMarginTop = this.stageHeight - this.innerStageHeight
                
                this.circleXProportion = this.options.circleXProportion;
                this.circleYProportion = this.options.circleYProportion;

                this.smallX = this.innerStageWidth * this.circleXProportion;
                this.smallY = this.stageMarginTop + (this.innerStageHeight * this.circleYProportion);

                this.radius = this.options.radius;
                this.opacity = this.options.opacity;
 
                // Width is one third of canvas * root(2)
                this.divSmallWidth = this.radius * 2 * 0.707;
                this.divSmallMarginLeft = this.divSmallWidth / -2;
   	            
                // Adjust the div height depending on what type of circle it is	
                if(this.options.type.match(/buzz/)) {
                    this.divSmallHeight = this.radius * 0.707;
                    //this.divSmallMarginTop = this.divSmallHeight / -2;
                    this.divSmallMarginTop = 0;
                } else {
                    this.divSmallHeight = this.radius * 2 * 0.707;
                    this.divSmallMarginTop = this.divSmallHeight / -2;
                }

                this.$circleDiv = $('<div/>', {
                }).html(
                    //this.options.vennData,
                    'Test html data'
                ).attr({
                    'id':'data',
                    'class':'venn-overlay',
                }).css({
                    position: "absolute",
                    top: this.smallY + "px",
                    left: this.smallX + "px",
                    width: this.divSmallWidth + "px",
                    marginLeft: this.divSmallMarginLeft + "px",
                    height: this.divSmallHeight + "px",
                    marginTop: this.divSmallMarginTop + "px",
                    overflow: 'hidden',
                    pointerEvents: 'none',
                    //border: "1px solid black",
                    zIndex:5,
                }).appendTo(
                    this.$content
                );

                this.circleImagePath = '/static/img/venn/'+this.type+'_big.png';
                
                // circleImageSmallWidth is a ratio of (3 - (3/√3) + (√3/3)) / 3 - (3/√3) + (√3/2) to stageWidth
                this.circleImageSmallWidth = this.innerStageHeight * 0.86472419;
                this.circleImageSmallHeight = this.innerStageHeight * 0.86472419;
                this.circleImageSmallMarginLeft = this.circleImageSmallWidth / -2;
                this.circleImageSmallMarginTop = this.circleImageSmallHeight / -2;

                this.circleImageSmallCSS = {
                    position: "absolute",
                    top: this.smallY + "px",
                    left: this.smallX + "px",
                    width: this.circleImageSmallWidth + "px",
                    marginLeft: this.circleImageSmallMarginLeft + "px",
                    height: this.circleImageSmallHeight + "px",
                    marginTop: this.circleImageSmallMarginTop + "px",
                    pointerEvents: 'none',
                    zIndex:5,
                    opacity:0,
                };
                
                this.bigY = this.stageHeight / 2;
                this.bigX = this.stageWidth / 2;
                
                this.circleImageBigMarginTop = this.stageHeight / -2;
                this.circleImageBigMarginLeft = this.stageWidth / -2;

                this.circleImageBigCSS = {
                    position: "absolute",
                    top: this.bigY + "px",
                    left: this.bigX + "px",
                    width: this.stageWidth + "px",
                    marginLeft: this.circleImageBigMarginLeft + "px",
                    height: this.stageHeight + "px",
                    marginTop: this.circleImageBigMarginTop + "px",
                    pointerEvents: 'none',
                    zIndex:5,
                    opacity:1,
                };

                this.$circleImage = $('<img/>', {
                }).attr({
                    'id':'circle',
                    'class':'venn-images',
                    'src':this.circleImagePath,
                }).css(
                    this.circleImageSmallCSS
                    //this.circleImageBigCSS
                ).appendTo(
                    this.$images
                );

                // Venn diagram background images
                this.$venn_diagram_img = $('<img/>', {
                    src: "/static/img/venn/venn_diagram.png",
                    width: this.width,
                    height: "auto",
                });

                this.backgroundID = this.type+'_background.png';
                this.backgroundImagePath = '/static/img/venn/'+this.type+'_cut.png';

                this.$backgroundImage = $('<img/>', {
                }).attr({
                    'id':'',
                    'class':'venn-images',
                    'src':this.backgroundImagePath,
                }).css({
                    position: "absolute",
                    top: 0 + "px",
                    left: 0 + "px",
                    width: this.stageWidth + "px",
                    height: this.stageHeight + "px",
                }).appendTo(
                    this.$images
                );

                // Listen to changes on other circle models, to know when to hide content
                this.circleTypes = new Array('friends', 'info', 'buzz');
                var removeIndex = this.circleTypes.indexOf(this.type);
                this.circleTypes.splice(removeIndex, 1);
                
                var model_bind_string = 'change:' + this.type + '.big';
                this.model.bind(model_bind_string, this.changeCircle);

                element = null;
                for (var i = 0; i < this.circleTypes.length; i++) {
                    element = this.circleTypes[i];
                    var model_bind_size_string = 'change:' + element + '.big';
                    this.model.bind(model_bind_size_string, this.changeCircle);
                }

            },

            changeCircle: function() {

                this.type_big_string = this.type + '.big';
                this.otherCircleBig_1 = this.circleTypes[0] + '.big';
                this.otherCircleBig_2 = this.circleTypes[1] + '.big';
                //(this.model.get(type_big_string)) ? this.goBig() : this.goSmall();

                if (this.model.get(this.type_big_string)) {
                    this.goBig();
                    console.log('changeCircle goBig');
                } else if (this.model.get(this.otherCircleBig_1) || this.model.get(this.otherCircleBig_2)) {
                    this.goCovered();
                    console.log('changeCircle goCovered');
                } else {
                    this.goSmall();
                    console.log('changeCircle goSmall');
                }


                // If one of the other circles is going big hide content, otherwise show it
                //(this.model.get(otherCircleBig_1) || this.model.get(otherCircleBig_2)) ? this.goCovered() : this.goUncovered();

            },

            goBig: function() {
		
                this.divScale = 1.5;
                this.divBigWidth = this.divSmallWidth * this.divScale;
                this.divBigMarginLeft = this.divBigWidth / -2;
                
                // Alter size of div for different circles
                if(this.options.type.match(/buzz/)) {
                    this.divBigHeight = this.divSmallHeight * this.divScale * 2;
                    this.divBigMarginTop = this.divBigHeight / -2;
                } else {
                    this.divBigHeight = this.divSmallHeight * this.divScale;
                    this.divBigMarginTop = this.divBigHeight / -2;
                }

                this.svg.hide();

                TweenLite.to(this.$circleDiv,  0.2, { css:{
                    top: this.stageHeight / 2,
                    left: this.stageWidth / 2,
                    width: this.divBigWidth + "px",
                    marginLeft: this.divBigMarginLeft + "px",
                    height: this.divBigHeight + "px",
                    marginTop: this.divBigMarginTop + "px",
                    zIndex: 10,
                }});

                TweenLite.to(this.$circleImage,  0.2, { css:
                    this.circleImageBigCSS
                });

                TweenLite.to(this.$backgroundImage,  0.2, { css:{
                    opacity:0,
                }});	

            },

            goSmall: function() {
                
                this.svg.show();

                TweenLite.to(this.$circleDiv,  1, { css:{

                    left: this.smallX + "px",
                    top: this.smallY + "px",
                    width: this.divSmallWidth + "px",
                    marginLeft: this.divSmallMarginLeft + "px",
                    height: this.divSmallHeight + "px",
                    marginTop: this.divSmallMarginTop + "px",
                    zIndex:5,
                }});

                TweenLite.to(this.$circleImage,  0.2, { css:
                    this.circleImageSmallCSS,
                });

                TweenLite.to(this.$circleDiv,  0.2, { css:{
                    opacity:1,
                }});	

                TweenLite.to(this.$backgroundImage,  0.2, { css:{
                    opacity:1,
                }});	

            },
            
            goCovered: function() {

                TweenLite.to(this.$backgroundImage,  0.2, { css:{
                    opacity:1,
                }});	

                this.svg.show();

                TweenLite.to(this.$circleDiv,  1, { css:{
                    opacity:0,
                }});	
            },
            
           /* 
            goBackOne: function() {
                this.circle.goBackOne();
            },

            goFront: function() {
                this.circle.goFront();
            },
            */

            render: function() {
                
                //this.layer.add(this.circle);
                //this.layer.add(this.dot);
                //this.layer.add(this.dot2);
            }
        });        

        window.VennDiagram = Backbone.View.extend({
            
            /*events: {
                 'click .home': 'home'
            },*/
            //el: $('#venn'),
            tagName: "h1",
            
            events: {
                "click #venn":"vennClicked",
                "click #friends":"friendsClicked",
                "click #info":"infoClicked",
                "click #buzz":"buzzClicked",
                "click #big_circle":"bigCircleClicked",
            },
 
            initialize: function() {
                
                _.bindAll(this, 'getHeight', 'vennClicked', 'changeSectionSize', 'goBig', 'goSmall', 'friendsClicked', 'infoClicked', 'buzzClicked', 'render');

                //this.delegateEvents(_.extend(this.events, {'mousedown #info': 'infoMouseDownHandler'}));

                this.width = this.options.width;
                this.height = this.options.height;

                // Radius of coloured circles is canvas height * ((3√3-2)/√3)/6
		        this.radius = this.height * 0.307549910;
                // Radius of V circle is canvas height canvas height * (√3-(1/√3))/6
                this.vradius = this.height * 0.19245008973;
                
                this.$canvas = this.$('#venn-canvas');

                this.$content = this.$('#venn-content');

                this.$images = this.$('#venn-images');
                
                this.$svgOverlay = this.$('#venn-svg');
                //$(this.el).attr('id', 'event-wrapper').html(ich.eventTemplate(this.model.toJSON()));

                this.sourceSVG = ich.vennDiagramSVG('null', true);

                this.vennDiagramSVG = SVG(this.$svgOverlay.get(0)).size(this.width, this.height);

                this.svgStore = this.vennDiagramSVG.svg(this.sourceSVG);

                this.vennSVG = this.svgStore.venn;
                this.friendsSVG = this.svgStore.friends;
                this.infoSVG = this.svgStore.info;
                this.buzzSVG = this.svgStore.buzz;

                this.bigCircle = this.svgStore.big_circle;
                this.bigCircle.hide();

                //var model_bind_string = 'change:' + this.type + '.big';
                this.model.bind('change:friends.big', this.changeSectionSize);
                this.model.bind('change:info.big', this.changeSectionSize);
                this.model.bind('change:buzz.big', this.changeSectionSize);

                console.log('Store', this.svgStore.info);
        
                //console.log('Store', this.vennSVG.get('info');

                //this.vennSVG.svg(this.sourceSVG.find('#info').get(0));

                /*
                this.vennDiagramSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                this.vennDiagramSVG.setAttribute('version', '1.1');
                this.vennDiagramSVG.setAttribute('style', 'border: 1px solid black');
                this.vennDiagramSVG.setAttribute('x', '0');
                this.vennDiagramSVG.setAttribute('y', '0');
                this.vennDiagramSVG.setAttribute('height', this.height);
                this.vennDiagramSVG.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
                this.vennDiagramSVG.setAttributeNS("http://www.w3.org/XML/1998/namespace", "xml:space","preserve");
                this.$vennDiagramSVG = $(this.vennDiagramSVG);

                this.$infoSVG = this.sourceSVG.find('#info');

                this.$vennDiagramSVG.appendTo(this.$svgOverlay);

                this.$infoSVG.appendTo(this.$vennSVG);
                */

                //this.vennSVG.appendChild(this.$infoSVG);

                //this.$svgOverlay.append(this.vennSVG);

                //this.vennSVG.appendChild(this.$infoSVG);

                //console.log('svgOverlay info is: ', this.$svgOverlay);
                //this.$infoOverlay = this.$svgOverlay.find('#info');
                //this.$infoOverlay.test = 
                //this.$infoOverlay.attr('onclick','alert("'+this.model.attributes.id+'");');
                //this.$infoOverlay.attr('id',this.model.attributes.id+'info');

                /*function createSVGElement( eltType, properties) { // Create an arbitrary SVG element
                    var tgt = document.getElementById("board");
                    var elt = document.createElementNS('http://www.w3.org/2000/svg', eltType);

                    for ( prop in properties ) {
                        elt.setAttribute(prop, properties[prop]);
                    }

                    tgt.appendChild(elt);
                }

                var circProperties = {'visibility': 'visible', 'pointer-events': 'all', 'r': '10'};
                circProperties.id = 'circ_10_10';
                circProperties.cx = 10;
                circProperties.cy = 10;
                circProperties.onclick =  'playMove("'+circProperties.id+'");';
                createSVGElement( 'circle', circProperties);
                */

                /*this.$infoOverlay.onclick=function() {
                    console.log('infoOverlay was clicked'); 
                    /*if (this.type.match('friends')) {
                        this.model.goBigFriends();
                    } else if (this.type.match('discounts')) {
                        this.model.goBigDiscounts();
                    } else if (this.type.match('buzz')) {
                        this.model.goBigBuzz();
                    }
                };
                    */

                /*
                this.sectionTypes = new Array('venn', 'friends', 'discounts', 'buzz');

                this.$venn_diagram_img = $('<img/>', {
                    src: "/static/img/venn/venn_diagram.png",
                    width: this.width,
                    height: "auto",
                });

                this.$venn_diagram_img.css({
                    position: "absolute",
                    top: 0 + "px",
                    left: 0 + "px",
                });

                this.$images.append(this.$venn_diagram_img);
                */

                /*
                this.$backgroundImage = $('<img/>', {
                }).attr({
                    'id':'venn-background',
                    'class':'venn-images',
                    'src':'/static/img/venn/venn_cut.png',
                }).css({
                    position: "absolute",
                    top: 0 + "px",
                    left: 0 + "px",
                    width: this.stageWidth + "px",
                    height: this.stageHeight + "px",
                }).appendTo(
                    this.$images
                );
                */

                this.buzzCircle = new VennCircleView({
                    model: this.model,
                    type: 'buzz',
                    vennData: this.model.attributes.buzz.title,
                    svg: this.buzzSVG,
                    images: this.$images,
                    content: this.$content,
                    overlay: this.$overlay,
                    //wrapper: $(this.el),
                    colour: 'red',
                    opacity: 0.4,
                    canvasWidth: this.width,
                    canvasHeight: this.height,
                    circleXProportion: 1 / 2,
                    circleYProportion: 2 / 3,
                    radius: this.radius,
                    zIndex: 3,
                });
               
                this.infoCircle = new VennCircleView({
                    model: this.model,
                    type: 'info',
                    vennData: this.model.attributes.info.title,
                    svg: this.infoSVG,
                    images: this.$images,
                    content: this.$content,
                    overlay: this.$overlay,
                    //wrapper: $(this.el),
                    colour: 'blue',
                    opacity: 0.5,
                    canvasWidth: this.width,
                    canvasHeight: this.height,
                    circleXProportion: 2 / 3,
                    circleYProportion: 1 / 3,
                    radius: this.radius,
                    zIndex: 4,
                });

                this.friendsCircle = new VennCircleView({
                    model: this.model,
                    type: 'friends',
                    vennData: this.model.attributes.friends.title,
                    svg: this.friendsSVG,
                    images: this.$images,
                    content: this.$content,
                    overlay: this.$overlay,
                    //wrapper: $(this.el),
                    colour: 'green',
                    opacity: 0.5,
                    canvasWidth: this.width,
                    canvasHeight: this.height,
                    circleXProportion: 1 / 3,
                    circleYProportion: 1 / 3,
                    // Radius is one third of canvas / root(2)
                    radius: this.radius,
                    zIndex: 5,
                });

                this.venn = new VennView({
                    model: this.model,
                    type: 'v',
                    svg: this.vennSVG,
                    images: this.$images,
                    overlay: this.$overlay,
                    colour: 'white',
                    opacity: 1,
                    canvasWidth: this.width,
                    canvasHeight: this.height,
                    circleXProportion: 1 / 2,
                    circleYProportion: 1 / 2,
                    radius: this.vradius,
                    zIndex: 8,
                });
                
                this.render();

            },

            changeSectionSize: function(e) {
                console.log('Diagram changeSize was called');
                (this.model.get('friends.big') || this.model.get('info.big') || this.model.get('buzz.big')) ? this.goBig() : this.goSmall();
            },

            goBig: function(e) {
                console.log('Diagram goBig was called');
                this.bigCircle.show();
            },

            goSmall: function(e) {
                console.log('Diagram goSmall was called');
                this.bigCircle.hide();
            },

            bigCircleClicked: function(e) {
                console.log('bigCircle was clicked');

                // Return false to stop event propagation
                return false;
            },

            vennClicked: function(e) {
                this.model.changeVennDiagram('venn');

                // Return false to stop event propagation
                return false;
            },

            friendsClicked: function(e) {
                this.model.changeVennDiagram('friends');

                // Return false to stop event propagation
                return false;
            },

            infoClicked: function(e) {
                this.model.changeVennDiagram('info');

                // Return false to stop event propagation
                return false;
            },

            buzzClicked: function(e) {
                this.model.changeVennDiagram('buzz');

                // Return false to stop event propagation
                return false;
            },
            
            getHeight: function() {
                //return this.raw_height * this.scale;       
                return;
            },

            render: function(){
                
                //this.layer.add(this.venn_diagram_img);
                //this.layer.add(this.test_circle);

                //this.stage.add(this.layer);

                return this;
            }

        });

        window.VEventLocation = Backbone.View.extend({
            
            events: {
                'click #location-name': 'nameClick'
            },

            initialize: function() {
                
                _.bindAll(this, 'getHeight', 'nameClick', 'showLocation', 'hideLocation', 'render');
                this.nameHeight = 28;
                this.mapHeight = 208;

                this.$locationName = $('<div/>', {
                    id: 'location-name',
                    'data-toggle': 'collapse',
                    'data-target': '#map-' + this.model.get('id'),
                }); 
                this.$locationName.html('Location: ');
                this.$locationName.append(this.model.attributes.location.name);

                //this.$locationName.click(this.model.toggleLocationVisibility);
                //this.$locationName.on('click', this.model.toggleLocationVisibility);

                this.$locationName.css({
                    //position: "absolute",
                    //top: "0px",
                    //left: "0px",
                    width: "100%",
                    height: this.nameHeight,
                    /*
                    marginLeft: this.divSmallMarginLeft + "px",
                    marginTop: this.divSmallMarginTop + "px",
                    */
                    //overflow: 'hidden',
                    //pointerEvents: 'none',
                    //border: "1px solid black",

                });

                this.$el.append(this.$locationName);

                //this.$map = $(<div id="map" class="collapse"></div>);
                this.$map = $('<div/>', {
                    id: 'map-' + this.model.get('id'),
                    class: 'collapse',
                    width: '100%',
                    height: '0px',
                });

                //this.$mapCanvas = $('<div id="map-canvas-' + this.model.get('id') + '" class="google-maps collapse"></div>');
                
                this.$mapCanvas = $('<div/>', {
                    id: 'map-canvas-' + this.model.get('id'),
                    class: 'google-maps',
                    width: '100%',
                    height: 208, 
                }); 
                //this.$mapCanvas = $('<div id="map-canvas-' + this.model.get('id') + '" class="location-collapse collapse"></div>');

                //console.log('getHeight: ', this.$mapCanvas.css('top'));

                this.mapOptions = {
                    zoom: 8,
                    center: new google.maps.LatLng(this.model.get('location.latitude'), this.model.get('location.longitude')),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                this.map = new google.maps.Map(this.$mapCanvas[0],
                      this.mapOptions);

                this.$map.append(this.$mapCanvas);
                this.$el.append(this.$map);
                //this.$('#map').append(this.$mapCanvas);

            },

            getHeight: function() {
                //console.log('getHeight: ', this.nameHeight + parseInt(this.$mapCanvas.css('height')));
                //return this.nameHeight + this.$mapCanvas.canvas.css('height');
                //return parseInt(this.$locationName.css('height')) + parseInt(this.$mapCanvas.css('height'));
                //return parseInt(this.$locationName.css('height')) + parseInt(this.$mapCanvas.css('height'));
                return;
            },

            nameClick: function(){
                this.model.toggleLocationVisibility();
            },
            
            showLocation: function(){
                
                console.log('showLocation', this.veventLocation);

            },

            hideLocation: function(){

            },

            render: function() {
            
            },

        });

        window.VEventView = Backbone.View.extend({
            //template: _.template($("#event-template").html()),
            tag: 'li',    
            //className: 'span4 event first',
            className: 'event-wrapper span4 first',

            events: {
                'click': 'eventWrapperClick'
            },

            initialize: function() {

                _.bindAll(this, 'eventWrapperClick', 'render');

                $(this.el).attr('id', 'event-wrapper').html(ich.eventTemplate(this.model.toJSON()));
                
                if (document.documentElement.clientWidth > 480) {

                    this.raw_width = 240;
                    this.raw_height = 240;
                    this.scale = 1;

                    this.width = this.raw_width * this.scale;
                    this.height = this.raw_height * this.scale;

                } else {

                    this.width = document.documentElement.clientWidth * 0.85;
                    this.height = document.documentElement.clientWidth * 0.85;
                    //this.height = this.width;
                    
                }

                //$(window).bind("resize.app", _.bind(this.resize, this));
                //this.single_resize_width = this.raw_width * this.scale;
                //this.height = this.raw_height * this.scale;

                this.$overlay = this.$('#event-overlay');

                this.$vennWrapper = this.$('#venn-wrapper');

                this.vennDiagram = new VennDiagram({
                    //el: this.$('#venn-wrapper'),
                    el: this.$vennWrapper,
                    model: this.model,
                    height:this.height,
                    width:this.width,
                });

                this.vennDiagram.parentView = this;
                
                // Set up the location section
                this.$locationWrapper = this.$('#location-wrapper');

                this.veventLocation = new VEventLocation({
                    el: this.$locationWrapper,
                    model: this.model
                });

                this.veventLocation.parentView = this;

                this.date = Date.parse(this.model.get('start'));
                this.humanDate = humanize.date('D g:i a', this.date);
                //this.average = 19 + 23 + 23 + 24 + 24 + 26 + 27 + 43 + 50 + 50;

                // Set up the content elements

                this.$title = $('<div/>', {
                }).html(this.model.attributes.name
                ).attr({
                    'id':'event-title',
                    'class':'event-overlay',
                }).css({
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    width: this.divSmallWidth + "px",
                    marginLeft: this.divSmallMarginLeft + "px",
                    height: this.divSmallHeight + "px",
                    marginTop: this.divSmallMarginTop + "px",
                    overflow: 'hidden',
                    //pointerEvents: 'none',
                    //border: "1px solid black",
                }).appendTo(
                    this.$overlay
                );

                this.$startEl = $('<div/>', {
                }).html(this.humanDate
                ).attr({
                    'id':'event-start',
                    'class':'event-overlay',
                }).css({
                    position: "absolute",
                    top: "195px",
                    left: "0px",
                    width: "60px",
                    //marginLeft: this.divSmallMarginLeft + "px",
                    //height: this.divSmallHeight + "px",
                    //marginTop: this.divSmallMarginTop + "px",
                    overflow: 'hidden',
                    //pointerEvents: 'none',
                    //border: "1px solid black",
                }).appendTo(
                    this.$overlay
                );

                this.$interestButton = $('<img/>', {
                    src: "/static/img/heart.png",
                    width: (this.width / 6) + "px",
                    height: "auto",
                }).attr({
                    'class': 'event-overlay',
                }).css({
                    position: "absolute",
                    top: this.height - (this.height / 6) + "px",
                    left: this.width - (this.width / 6) + "px",
                }).appendTo(
                    this.$overlay
                );

                //this.$overlay.append(this.$interestButton);
                console.log('VEventView element: ', this.$el);

                this.model.bind('change:location.visible', this.toggleLocationVisibility);

                /*wrapperHeight = this.getHeight();
                this.$el.css({
                    height: wrapperHeight + "px",
                });*/
            },

            eventWrapperClick: function() {
                console.log('eventWrapperClick outside');
                this.model.changeVennDiagram('outside');
            },

        });
        
        window.ListVEventView = VEventView.extend({

        });

        window.Filter = Backbone.View.extend({

            initialize: function() {
                _.bindAll(this, 'render');
                this.collection.bind('reset', this.render);
            },
           
            render: function() {

            },

        }); 

        window.ListView = Backbone.View.extend({
            
            tagName: 'section',
            className: 'list',
            template: _.template($('#list-template').html()),

            initialize: function() {
                _.bindAll(this, 'render');
                //this.collection.bind('change', this.render);
                this.collection.bind('reset', this.render);
                //this.render();
            },

            test: function() {
                showAlert();
            },

            render: function() {
                console.log('render was called on ListView');
                var $vevents,
                collection = this.collection;
                
                //$(this.el).html(ich.listApp(this.model.toJSON()));
                $(this.el).html(this.template({})); 
                //$(this.el).html('Test test test');

                //$vevents = this.$('events');
                //this.$el.html('Still testing that html..');
                this.collection.each(function(vevent) {
                    var view = new ListVEventView({
                        model: vevent,
                        collection: collection,
                    });
                    this.$('#events').append(view.render().el);
                });
                return this;
            }
        });
        
        window.VRouter = Backbone.Router.extend({
                routes: {
                    '': 'home',
                    ':id/': 'detail',
                    'blank': 'blank'
                },

                initialize: function() {
                    this.$app = $('#app');
                    this.eventsListView = new ListView({
                        collection: window.eventsList,
                        el: this.$app,
                        //eventList: window.eventList
                        //collection: window.player.playlist,
                        //player: window.player,
                        //library: window.library
                    });

                    /*
                    this.detailApp = new VEventDetailApp({
                        el: $('#app')
                    });
                    */
                    /*this.libraryView = new LibraryView({
                        collection: window.eventList
                        //collection: window.library
                    });*/
                },

                home: function() {
                    $('#app').empty();
                    //$("#app").append(this.eventsListView.render().el);
                    window.app.eventsListView.render();
                    //this.eventsListView.render()
                },

                navigate_to: function(model){
                    var path = (model && model.get('id') + '/') || '';
                    this.navigate(path, true);
                },
                
                detail: function(id){
                    window.eventsList.getOrFetch( id, {
                        success: function(model){
                            window.app.detailApp.model = model;            
                            window.app.detailApp.render();            
                            //$('#app').empty();
                            //.detailApp.model = model;
                            //("#app").append(this.detailApp.render().el);
                        }
                    });
                },

                //detail: function(){},

                list: function(){},

                blank: function() {
                    $('#app').empty();
                    $('#app').text('blank');
                    //$('#app').append(this.detailApp.render().el);
                }
        });

        // Kick off the application
        window.app = new VRouter();
        //Backbone.history.start();
        /*Backbone.history.start({
            pushState: true,
            silent: app.loaded
        });*/
    
    });
    /*eventsList = new VEvents();

    eventsListView = new ListView({ collection: eventsList });

    $('#app').append(eventsListView.render().el);

    eventsList.fetch();*/


})(jQuery);

//	window.App = new

    /*window.VEvent = Backbone.Model.extend({
        urlRoot: PAGE_API
    });

    window.Events = Backbone.Collection.extend({
        urlRoot: PAGE_API,
        model: VEvent, 

        maybeFetch: function(options){
            // Helper function to fetch only if this collection has not been fetched before.
            if(this._fetched){
                // If this has already been fetched, call the success, if it exists
                options.success && options.success();
                return;
            }

            // when the original success function completes mark this collection as fetched
            var self = this,
                successWrapper = function(success){
                    return function(){
                        self._fetched = true;
                        success && success.apply(this, arguments);
                    };
                };
            options.success = successWrapper(options.success);
            this.fetch(options);
        },

        getOrFetch: function(id, options){
            // Helper function to use this collection as a cache for models on the server
            var model = this.get(id);

            if(model){
                options.success && options.success(model);
                return;
            }

            model = new VEvent({
                resource_uri: id
            });

            model.fetch(options);
        }
        

    });

    window.EventView = Backbone.View.extend({
        tagName: 'li',
        className: 'event',

        events: {
            'click .permalink': 'navigate'           
        },

        initialize: function(){
            this.model.bind('change', this.render, this);
        },

        navigate: function(e){
            this.trigger('navigate', this.model);
            e.preventDefault();
        },

        render: function(){
            $(this.el).html(ich.eventTemplate(this.model.toJSON()));
            return this;
        }                                        
    });


    window.DetailApp = Backbone.View.extend({
        events: {
            'click .home': 'home'
        },
        
        home: function(e){
            this.trigger('home');
            e.preventDefault();
        },

        render: function(){
            $(this.el).html(ich.detailApp(this.model.toJSON()));
            return this;
        }                                        
    });

    window.InputView = Backbone.View.extend({
        events: {
            'click .event': 'createEvent',
            'keypress #message': 'createOnEnter'
        },

        createOnEnter: function(e){
            if((e.keyCode || e.which) == 13){
                this.createEvent();
                e.preventDefault();
            }

        },

        createEvent: function(){
            var message = this.$('#message').val();
            if(message){
                this.collection.create({
                    message: message
                });
                this.$('#message').val('');
            }
        }

    });

    window.ListView = Backbone.View.extend({
        initialize: function(){
            _.bindAll(this, 'addOne', 'addAll');

            this.collection.bind('add', this.addOne);
            this.collection.bind('reset', this.addAll, this);
            this.views = [];
        },

        addAll: function(){
            this.views = [];
            this.collection.each(this.addOne);
        },

        addOne: function(vent){
            var view = new EventView({
                model: event 
            });
            $(this.el).prepend(view.render().el);
            this.views.push(view);
            view.bind('all', this.rethrow, this);
        },

        rethrow: function(){
            this.trigger.apply(this, arguments);
        }

    });

    window.ListApp = Backbone.View.extend({
        el: "#app",

        rethrow: function(){
            this.trigger.apply(this, arguments);
        },

        render: function(){
            $(this.el).html(ich.({}));
            var list = new ListView({
                collection: this.collection,
                el: this.$('#events')
            });
            list.addAll();
            list.bind('all', this.rethrow, this);
            new InputView({
                collection: this.collection,
                el: this.$('#input')
            });
        }        
    });

    
    window.Router = Backbone.Router.extend({
        routes: {
            '': 'list',
            ':id/': 'detail'
        },

        navigate_to: function(model){
            var path = (model && model.get('id') + '/') || '';
            this.navigate(path, true);
        },

        detail: function(){},

        list: function(){}
    });

    $(function(){
        window.app = window.app || {};
        app.router = new Router();
        app.events = new Events();
        app.list = new ListApp({
            el: $("#app"),
            collection: app.events
        });
        app.detail = new DetailApp({
            el: $("#app")
        });
        app.router.bind('route:list', function(){
            app.events.maybeFetch({
                success: _.bind(app.list.render, app.list)                
            });
        });
        app.router.bind('route:detail', function(id){
            app.events.getOrFetch(app.events.urlRoot + id + '/', {
            //app.events.getOrFetch(app.events.urlRoot , {
                success: function(model){
                    app.detail.model = model;
                    app.detail.render();                    
                }
            });
        });

        app.list.bind('navigate', app.router.navigate_to, app.router);
        app.detail.bind('home', app.router.navigate_to, app.router);
        Backbone.history.start({
            pushState: true, 
            silent: app.loaded
        });
    });
})();*/
