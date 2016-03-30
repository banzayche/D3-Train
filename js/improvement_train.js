var trainMovement = function(){
	// attributes for moving on scroll event
	var moveCount = 0;

	// main attributes
	var conteiner = d3.select("body")
	var w = 1310;
	var h = 3747;
	
	// Gaps between the carriages
	var gapValue = 80;
	var carriageYCoord = 74.8;
	var carriageWidth = 60;
	var carriageHeight = 30;

	var svg = conteiner.append("svg")
				.attr("width", w)
				.attr("height", h);

	var pathString = "M43.5,74.8 c0,0,972.9,0,1128,0c65,0,97.5,48.5,97.5,97.5c0,41.5,0,1158,0,1118c0,60,2.7,137.5-117,137.5c-135.2,0-717.1,0-899.5,0 c-104,0-171.5,67.2-171.5,166c0,46,0,398.5,0,532.5c0,62.7,35,134.5,139,134.5c58.3,0,614.7,0,640,0s226.5,0,239.6,0 c76.5,0,127.4,63,127.4,126.7c0,49.5,0,874.3,0,1133.8c0,82-27,183-133,183c-6.4,0-813.5,0-919.5,0c-74,0-118.7-53-118.5-116 c0.1-40.5,37.8-91,88-91l3.1,0.2c45.6,0,82.6,32,82.6,77.6c0,36.5-29.6,66.1-66.1,66.1c-29.2,0-52.9-23.7-52.9-52.9 c0-23.4,18.9-42.3,42.3-42.3c18.7,0,32.8,15.4,32.8,34.1";

	svg.append('path')
		.attr('d', pathString)
		.attr('stroke', '#C85432')
		.attr('fill', 'none')
		.classed('path-main', true);

	var path = svg.select(".path-main");

	var trackSize = path.node().getTotalLength();

	var finiteStateMachine = function(){
		var self = this;
		this.currentPoint = null;
		// element - carriage
		this.element = null;
		this.gap = null; 
		this.isntRun = true;
		this.lastMoveCount = moveCount;
		this.direction = 'forward';
		this.newDirection = 'forward';
		this.timeSeconds = 15000;

		this.hotStopTime = 0;
		this.hotStop = false;

		this.control = {
			$: {
				x: 		0,
				y: 		0,
				angle: 	0,
				point1: null,
				point2: null,
				mainPath: true,
				direction: 'forward',
				coefficient: 1,
				stopPoint: 2000
			}
		};

		this.states = {
			points: [
				{
					endPoint: 0.02
				},{
					endPoint: 0.25
				},{
					endPoint: 0.50
				},{
					endPoint: 0.66
				},{
					endPoint: 0.8
				},{
					endPoint: 0.96
				}
			],
			increase: {
				point0: 480,
				point1: 2100,
				point2: 3700,
				point3: 5500,
				point4: 6000,
				point5: 7000,
				point6: 7650
			}
		};

		//Get path start point for placing marker
		this.pathStartPoint = function(number) {
	  		var lengthTrain = factory.carriages.length-1;
	  		if( number === 0 ){
	  			return factory.gapArr[lengthTrain]+',' + (carriageYCoord - carriageHeight/2)
	  		} else{
	  			return factory.gapArr[lengthTrain-number]+',' + (carriageYCoord - carriageHeight/2)
	  		}
	  	}

		this.mainInit = function(){
			this.element.append("rect")
				.attr("width", carriageWidth/2)
				.attr('height', carriageHeight/1.8)
				.attr('stroke', 'steelblue')
				.attr('fill', 'orange')
				.attr('y', 7)
				.attr('x', 30)

			this.element.append("rect")
				.attr("width", carriageWidth/2)
				.attr('height', carriageHeight)
				.attr('stroke', 'steelblue')
				.style("stroke-width", "2")
				.attr('fill', 'orange')
				.attr('x', 0)
				.attr('rx', 5)

			this.element.append("polygon")
			    .style("fill", "white")
			    .style("stroke", "steelblue")
			    .style("stroke-width", "2")
			    .attr("points", "60,2 70,15 60,28");
			
			// left wheels
			this.element.append("rect")
				.attr("width", 10)
				.attr('height', 3)
				.attr('stroke', 'steelblue')
				.attr('fill', 'white')
				.attr('x', 47)
				.attr('y', 4)
				.attr('rx', 5)
			this.element.append("rect")
				.attr("width", 10)
				.attr('height', 3)
				.attr('stroke', 'steelblue')
				.attr('fill', 'white')
				.attr('x', 35)
				.attr('y', 4)
				.attr('rx', 5)

			// right wheels
			this.element.append("rect")
				.attr("width", 10)
				.attr('height', 3)
				.attr('stroke', 'steelblue')
				.attr('fill', 'white')
				.attr('x', 47)
				.attr('y', 24)
				.attr('rx', 5)
			this.element.append("rect")
				.attr("width", 10)
				.attr('height', 3)
				.attr('stroke', 'steelblue')
				.attr('fill', 'white')
				.attr('x', 35)
				.attr('y', 24)
				.attr('rx', 5)

			// center tail-pipes
			this.element.append('circle')
				.attr('cx', 50)
				.attr('cy', 15)
				.attr('r', 3)				
				.style("stroke-width", "3")
				.attr('stroke', 'grey')
				.attr('fill', 'white')
			this.element.append('circle')
				.attr('cx', 40)
				.attr('cy', 15)
				.attr('r', 3)
				.attr('fill', 'white')
				.attr('stroke', 'grey')
		};

		this.init = function(options){
			this.element = svg.append('g')
				.attr('id', options.type)
				.attr("transform", "translate(" + this.pathStartPoint(options.number) + ")")
				.attr('width', carriageWidth)
				.attr('height', carriageHeight)
				.attr('T', this.states.increase.point0);			
			
			this.type = options.type;

			if( options.type === 'main' ) {
				this.mainInit();
			} else{
				this.element.append("rect")
					.attr("width", carriageWidth)
					.attr('height', carriageHeight/1.3)
					.attr('stroke', 'steelblue')
					.style("stroke-width", "2")
					.attr('fill', 'orange')
					.attr('y', 3)
					.attr('rx', 5)

				// left wheels
				this.element.append("rect")
					.attr("width", 10)
					.attr('height', 3)
					.attr('stroke', 'steelblue')
					.attr('fill', 'white')
					.attr('x', 7)
					.attr('y', 0)
					.attr('rx', 5)
				this.element.append("rect")
					.attr("width", 10)
					.attr('height', 3)
					.attr('stroke', 'steelblue')
					.attr('fill', 'white')
					.attr('x', 42)
					.attr('y', 0)
					.attr('rx', 5)

				// right wheels
				this.element.append("rect")
					.attr("width", 10)
					.attr('height', 3)
					.attr('stroke', 'steelblue')
					.attr('fill', 'white')
					.attr('x', 7)
					.attr('y', 26)
					.attr('rx', 5)
				this.element.append("rect")
					.attr("width", 10)
					.attr('height', 3)
					.attr('stroke', 'steelblue')
					.attr('fill', 'white')
					.attr('x', 42)
					.attr('y', 26)
					.attr('rx', 5)
			}
			
			this.control.$.coefficient = options.coefficient;
			this.gap = options.gap;
		}

		this.resolvePoint = function(pointPath, pointValue) {
			// var top = document.getElementsByTagName('rect')[0].getBoundingClientRect().top;
			// console.log('pointPath', pointPath);
			// console.log('this.control.$.stopPoint', this.control.$.stopPoint);

			// check the direction
			if( moveCount >= this.lastMoveCount ){
				this.newDirection = "forward";
			} else if( moveCount < this.lastMoveCount ){
				this.newDirection = "backward";
			}


			if(this.currentPoint !== pointValue || this.hotStop === true){
				pointPath = this.states.increase['point'+pointValue];


				this.currentPoint = pointValue;
				this.control.$.stopPoint = pointPath;

				if( this.isntRun === true ){
					this.direction = this.newDirection;

					this.runTrain({
						name: 'start',
						direction: this.direction
					});

					this.isntRun = false;
					// console.warn('run')
				}

				// fixation of last moveCount to understand direction of scrolling
				this.lastMoveCount = moveCount;
			} else{
				// console.warn('cant run')
			}
		};

		this.resolveMovement = function(){

			if( moveCount > 1 ){
				moveCount = 1;
			} 

			// self.hotStopTime = 0;

			// this.tBreak = moveCount;
			var pointValue;
			var pointPath;
			// this.transition();
			switch (true) {
				case moveCount>=this.states.points[0].endPoint && moveCount<this.states.points[1].endPoint:
					pointValue = 1;
					this.resolvePoint(pointPath, pointValue);								
					
					break;
				case moveCount>=this.states.points[1].endPoint && moveCount<this.states.points[2].endPoint:
					pointValue = 2;
					this.resolvePoint(pointPath, pointValue);
					break;
				case moveCount>=this.states.points[2].endPoint && moveCount<this.states.points[3].endPoint:
					pointValue = 3;
					this.resolvePoint(pointPath, pointValue);
					break;
				case moveCount>=this.states.points[3].endPoint && moveCount<this.states.points[4].endPoint:
					pointValue = 4;
					this.resolvePoint(pointPath, pointValue);
					break;
				case moveCount>=this.states.points[4].endPoint && moveCount<this.states.points[5].endPoint:
					pointValue = 5;
					this.resolvePoint(pointPath, pointValue);
					break;
				case moveCount>=this.states.points[5].endPoint:
					pointValue = 6;
					this.resolvePoint(pointPath, pointValue);
					break;

			  default:
				pointValue = 0;
				this.resolvePoint(pointPath, pointValue);
			}
		};

		this.lazyCall = _.debounce(function(){console.log('Curretn point '+self.currentPoint)}, 300);

		this.runTrain = function(option) {
			option.name = !!option.name && typeof option.name === 'string' ? option.name.toLowerCase() : 'stop';			
			
			// FOR FORWARD DIRECTION
			if( option.name === 'start' && option.direction === 'forward' ){
			
				var time = !!self.element.attr('T') ? ((((trackSize-self.element.attr('T'))/(trackSize/100))/100)*self.timeSeconds)+self.hotStopTime : self.timeSeconds+self.hotStopTime;
				
				self.element.transition().duration(time/self.control.$.coefficient).ease('ease-in-out')
					.attrTween('T', attrTweenTrack());

				// Prevent shivering
				var timeoutShivering = true;
				var setTimeOut = true;

				function attrTweenTrack(){
					var newValue = trackSize;
					return function(){
						var currentValue = +self.element.attr('T');
						var i = d3.interpolateNumber( currentValue, newValue );
						var prevPoint = null;
						return function(t) {
							
							self.control.$.point1 = path.node().getPointAtLength(prevPoint-self.gap);
							self.control.$.point2 = path.node().getPointAtLength(i(t)-self.gap);

							if( timeoutShivering === false ){
								self.control.$.angle = Math.atan2(self.control.$.point2.y - self.control.$.point1.y, self.control.$.point2.x - self.control.$.point1.x) * 180 / Math.PI;
							} else if( timeoutShivering === true && setTimeOut === true){
								setTimeout(function(){
									timeoutShivering = false;
								}, 10)
								setTimeOut = false;
							}
							

							prevPoint = i(t);
							
							//Shifting center to center of self.element
							self.control.$.x = self.control.$.point2.x - carriageWidth,
							self.control.$.y = self.control.$.point2.y - carriageHeight/2;
							
							self.element.attr('transform', "translate(" + self.control.$.x + "," + self.control.$.y + ")rotate(" + self.control.$.angle + " " + carriageWidth + " "+ carriageHeight/2 +")");
							self.element.attr('T', i(t));

							// conditions for train stop
							if( i(t) >= self.control.$.stopPoint ){						
								self.runTrain({
									name: 'stop'
								});							
							// recovery values after hot stop
								self.hotStop = false;
								self.hotStopTime = 0;

							// For calling hint window
								if(self.type === 'main'){
									self.lazyCall();						
								}
							} else if( i(t) >= +self.control.$.stopPoint-100 && self.hotStop === false){

								// values for hot stop
								self.hotStop = true;
								self.hotStopTime = 7000;

								self.runTrain({
									name: 'stop'
								});

								self.resolveMovement();
							}

							return i(t);
						 }
					}
				}
			}
			// FOR BACKWARD DIRECTION
			else if( option.name === 'start' && option.direction === 'backward' ){
				
				var time = !!self.element.attr('T') ? (((+self.element.attr('T')/(trackSize/100))/100)*self.timeSeconds)+self.hotStopTime : self.timeSeconds+self.hotStopTime;
				
				self.element.transition().duration(time/self.control.$.coefficient).ease('ease-in-out')
					.attrTween('T', attrTweenTrack());

				// Prevent shivering
				var timeoutShivering = true;
				var setTimeOut = true;

				function attrTweenTrack(){
					var newValue = trackSize;
					return function(){
						var currentValue = +self.element.attr('T');
						var i = d3.interpolateNumber( currentValue, 0 );

						var prevPoint = null;
						return function(t) {
							self.control.$.point1 = path.node().getPointAtLength(prevPoint-self.gap);
							self.control.$.point2 = path.node().getPointAtLength(i(t)-self.gap);
							
							if( timeoutShivering === false ){
								self.control.$.angle = Math.atan2(self.control.$.point2.y - self.control.$.point1.y, self.control.$.point2.x - self.control.$.point1.x) * 180 / Math.PI;
							} else if( timeoutShivering === true && setTimeOut === true){
								setTimeout(function(){
									timeoutShivering = false;
								}, 10)
								setTimeOut = false;
							}

							// console.log('angle ', self.control.$.angle);
							prevPoint = i(t);
							
							//Shifting center to center of self.element
							self.control.$.x = self.control.$.point2.x - carriageWidth,
							self.control.$.y = self.control.$.point2.y - carriageHeight/2;
							
							self.element.attr('transform', "translate(" + self.control.$.x + "," + self.control.$.y + ")rotate(" + self.control.$.angle + " " + carriageWidth + " "+ carriageHeight/2 +")");
							self.element.attr('T', i(t));

							// conditions for train stop
							if( i(t) <= self.control.$.stopPoint ){						
								self.runTrain({
									name: 'stop'
								});
							// recovery values after hot stop
								self.hotStop = false;
								self.hotStopTime = 0;

							// For calling hint window
								if(self.type === 'main'){
									self.lazyCall();						
								}						
							} else if( i(t) <= +self.control.$.stopPoint+100 && self.hotStop === false){

								// values for hot stop
								self.hotStop = true;
								self.hotStopTime = 7000;

								self.runTrain({
									name: 'stop'
								});
								
								self.resolveMovement();
							}
							return i(t);
						 }
					}
				}
			}

			else if(option.name === 'stop'){
				self.element.transition().duration(0);
				self.isntRun = true;
			}
		};
	};
	
	// Factory
	var factory = {
		readyToUse: false,
		gapArr: [],
		carriages: [],
		createCarriage: function(quantity){
			for(var i = 0; i<quantity; i++){
				this.gapArr[i] = i*gapValue;
			}

			for(var i = 0; i<quantity; i++){
				this.carriages[i] = new finiteStateMachine();
			}

			this.initCarriages();
		},
		initCarriages: function(){
			var self = this;
			this.carriages.map(function(carriage, index){
				if(index === 0) {
					carriage.init({coefficient: 1, gap: self.gapArr[index], number: index, type: 'main'});
				} else{
					carriage.init({coefficient: 1, gap: self.gapArr[index], number: index, type: 'secondary'});
				}				
			});

			this.readyToUse = true;
		},
		retranslator: function(method){
			if(this.readyToUse === true) {
				this.carriages.map(function(carriage, index){
					carriage[method]();
				});
			}
		}
	}

	// Creating of the carriages
	// better to not use more than 10 carriages
	factory.createCarriage(6);

	// how many percents we have scrolled
	$(window).scroll(function(e){
		var scrollTop = $(window).scrollTop();
		var docHeight = $(document).height();
		var winHeight = window.innerHeight;
		var scrollPercent = (scrollTop) / (docHeight - winHeight);
		var scrollPercentRounded = Math.round(scrollPercent*100);

		moveCount = scrollPercentRounded/100;

		factory.retranslator('resolveMovement');
	});
};