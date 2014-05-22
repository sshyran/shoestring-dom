// Extensions

// keep this wrapper around the ones you use!
(function( undefined ){
	shoestring.fn.bind = function( evt, callback ){
		var evts = evt.split( " " ),
			bindingname = callback.toString(),
			boundEvents = function( el, evt, callback ) {
				if ( !el.shoestringData ) {
					el.shoestringData = {};
				}
				if ( !el.shoestringData.events ) {
					el.shoestringData.events = {};
				}
				if ( !el.shoestringData.events[ evt ] ) {
					el.shoestringData.events[ evt ] = [];
				}
				el.shoestringData.events[ evt ][ bindingname ] = callback.callfunc;
			};

		function newCB( e ){
			return callback.apply( this, [ e ].concat( e._args ) );
		}
		function propChange( e, oEl ) {
			var el = document.documentElement[ e.propertyName ].el;

			if( el !== undefined && oEl === el ) {
				newCB.call( el, e );
			}
		}
		return this.each(function(){
			for( var i = 0, il = evts.length; i < il; i++ ){
				var evt = evts[ i ],
					oEl = this;

				if( "addEventListener" in this ){
					this.addEventListener( evt, newCB, false );
				} else if( this.attachEvent ){
					if( this[ "on" + evt ] !== undefined ) {
						this.attachEvent( "on" + evt, newCB );
					} else {
						// Custom event
						document.documentElement.attachEvent( "onpropertychange", function( e ) {
							propChange.call( this, e, oEl );
						});
					}
				}
				boundEvents( this, evts[ i ], { "callfunc" : newCB, "name" : bindingname });
			}
		});
	};
}());