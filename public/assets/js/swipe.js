


	var openPhotoSwipe = function(i) {
		console.log('open', i) 
		var pswpElement = document.querySelectorAll('.pswp')[0];

		// build items array
		
		// define options (if needed)
		var options = {
				 // history & focus options are disabled on CodePen        
			history: false,
		    index: i,
			focus: false,

			showAnimationDuration: 0,
			hideAnimationDuration: 0
			
		};
		
		var gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
		gallery.init();
	};

	//openPhotoSwipe();

	$('#photos').on('click', 'img', function() {
		openPhotoSwipe($(this).index()); 		
	});
	
	$('#container img').on('click', function() {
		openPhotoSwipe(0); 		
	});

	$('#save').click(()=>{ alert('Coming Soon!') })


	$('#contact').click(()=>{ 

		window.location.assign(`${window.location.origin}/contact${window.location.search}`);
			
	})

