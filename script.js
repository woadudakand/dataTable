
$.fn.dataTable = function() {
	var selector = $(this);
	selector.map(function(index, selEl) {

		var thead = selEl.querySelector('table thead'),			
		table 	  = selEl.querySelector('table'),			
		th 		  = thead.querySelectorAll('tr th'),
		tbody 	  = selEl.querySelector('tbody'),
		datatr 	  = tbody.querySelectorAll('tr'),
		td  	  = tbody.querySelectorAll('tr td');
		
		// drag able section		
		function allowDrop(ev) {
			ev.preventDefault();
		}		  
		function drag(ev) {
			ev.dataTransfer.setData("text", ev.target.id);			
		}		
		function drop(ev) {
			ev.preventDefault();
			var data = ev.dataTransfer.getData("text");
			ev.target.appendChild(document.getElementById(data));
		}
		$(datatr).each((index, el) => {
			$(el).attr({'id':'id_'+index, 'draggable': 'true'});
			$(el).on('dragstart', (e) => {
				drag(event);
				$(table).css({'border-spacing': '1px 10px'});
			});
		});
		$(table).on('drop', () =>{
			drop(event);
			$(table).css({'border-spacing': '1px 1px'});
		});
		$(table).on('dragover', () =>{
			allowDrop(event);			
		});
		// drag able section end
		
		
		$(table).append(`<tfoot><tr class="trnone"></tr></tfoot>`); //table footer add
		//query section add 
		var append = '<div class="component"><select class="pageCount"><option value="">Per Page</option><option value="5">5</option><option value="10">10</option> <option value="20">20</option> <option value="35">35</option> <option value="50">50</option> </select><select name="query" class="query"></select><input type="text" class="value"></div>';
		$(append).prependTo(selEl);
		//query section add 
		tfoot 	  	= selEl.querySelector('tfoot');
		var key 	= [];
		var headKeyVal = th;
		$(headKeyVal).each(function(index, el) {
			$(el).css({cursor: 'pointer'})
			key.push($(el).text());
			$(el).append('<i class="fas fa-long-arrow-alt-down" style="float: right; color: #ddd"></i> <i class="fas fa-long-arrow-alt-up" style="float: right; color: #ddd""></i>');
			var count = 0;
			$(el).on('click', (e) => {
				var tr = datatr;			
				$(headKeyVal).find('i').css({color: '#ddd'});
				count ++;				
				var tr = datatr;
				var sort = [];
				 $(tr).each(function(index1, el) {	 			
					 var query = el.querySelectorAll('td')[index];
					 sort.push(query);					
				});
				var rev = null;
				if(count%2 != 0){					
					$(this).find('.fa-long-arrow-alt-down').css({color: '#000'});
					rev = sort.sort(function(a, b) {
						var textA = $(a).text();
						var textB = $(b).text();
						if (textA < textB) return -1;
						if (textA > textB) return 1;				
						return 0;
					});				
				} else {
					$(this).find('.fa-long-arrow-alt-up').css({color: '#000'});
					rev = sort.sort(function(a, b) {
						var textA = $(a).text();
						var textB = $(b).text();
						if (textA < textB) return 1;
						if (textA > textB) return -1;				
						return 0;
					});	
				}

				var sortel = [];
				rev.map((el, index) => {					
					sortel.push($(el).closest('tr'));
				});											
				$(tbody).html(sortel);							
			});
		});
		var	option = '';
		$(key).map((index, el) => {
			option += '<option value="'+index+'">'+el+'</option>';
		});
		var selquery = selEl.querySelector('.query');
		selquery.innerHTML = '<option value="">Select for Query</option>'+option;		
		var bodyRow = td;			
		var array = [];
		$(bodyRow).map(function(index, elem) {		
			array.push(elem);		
		});				
		
		// keyup section start
		var inputVal = selEl.querySelector('.value');
		$(inputVal).on('keyup', function(event) {
			event.preventDefault();
			var value = $(this).val().toLowerCase();
			var filter = [];
			var filter = array.filter(function(el) {
				if ($(el).text().toLowerCase().startsWith(value)){
					return el;
				}
			});
			var tr = datatr;	
			tr.forEach(el => {
				$(el).removeClass('block');
				$(el).addClass('none');
			});		
			if(filter.length){	
				filter.map(function(index, elem) {
					var style = index.closest('tr');
					$(style).removeClass('none');
					$(style).addClass('block');					
				});
				$(tfoot).find('.trnone').html('');
			} else {
				var tr = `<td colspan=${th.length} style="text-align: center;">Data not found</td>`
				$(tfoot).find('.trnone').html(tr);
			}
		});
		// keyup section end ...........
		//query by select ................
		$(selquery).on('change', function(event) {
			 event.preventDefault();
			 if($(this).val() != '') {
				 // query section start
				 bodyRow = [];
				 var index1 = $(this).val();
				 var tr = datatr;
				 $(tr).each(function(index, el) {	 			
					 var query = el.querySelectorAll('td')[index1];	 			
					 bodyRow.push(query);
				 });
				 var array = [];
				 bodyRow.map(function(elem, index) {		
					 array.push(elem);		
				 });
	 
	 
				 // keyup section start
				 $(inputVal).on('keyup', function(event) {
					 event.preventDefault();
					 var value = $(this).val().toLowerCase();				
					 var filter = array.filter(function(el) {
						 if ($(el).text().toLowerCase().startsWith(value)){
							 return el;
						 }
					 });
					var tr = datatr;
					 tr.forEach(el => {
						 $(el).removeClass('block');
						 $(el).addClass('none');
					 });
					 	 
					 if(filter.length){	
						 filter.map(function(item, elem) {
							 var style = item.closest('tr');						
							 $(style).removeClass('none');
							 $(style).addClass('block');
						 });
						 $(tfoot).find('.trnone').html('');
					 } else {
						var tr = `<td colspan=${th.length} style="text-align: center;">Data not found</td>`
						$(tfoot).find('.trnone').html(tr);						
					 }	 
					 	 
				 });
				 // keyup section end	 		
			 } else {
				 // query section start
				 var bodyRow = td;
				 var array = [];
				 console.log(array);
				 bodyRow.forEach(function(elem, index) {		
					 array.push(elem);		
				 });
				 // keyup section start
				 $(inputVal).on('keyup', function(event) {
					 event.preventDefault();
					 var value = $(this).val().toLowerCase();
					 var filter = [];
					 var filter = array.filter(function(el) {
						 if ($(el).text().toLowerCase().startsWith(value)){
							 return el;
						 }
					 });					 
					 var tr = datatr;
					 tr.forEach(el => {
						 $(el).removeClass('block');
						 $(el).addClass('none');
					 });	 
					 if(filter.length){	
						 filter.map(function(index, elem) {
							 var style = index.closest('tr');
							 $(style).removeClass('none');
							 $(style).addClass('block');
						 });
						 $(tfoot).find('.trnone').html('');
					 } else {
						 var tr = `<td colspan=${th.length} style="text-align: center;">Data not found</td>`
						 $(tfoot).find('.trnone').html(tr);
					 }
				 });
				 // keyup section end
			 }
		});
		//query by select end................
		// per page section start
		$('body').on('change', '.pageCount', function(event) {
			event.preventDefault();
			var val = $(this).val();
			if(val !== ''){
				$(datatr).addClass('block');
				$(datatr).hide();
				if($(datatr).hasClass('block')){
					$(datatr).slice(0, val).show();					
				}		
				$(inputVal).on('keyup', function(event) {
					event.preventDefault();
					$(datatr).hide();			
					var tr = tbody.querySelectorAll('tr.block');
					$(tr).slice(0, val).show();
				});
			} else {
				$(datatr).show();
			}	
		});
		// per page section end

		// pagination start
		var page = '<ul class="page"></ul>';
		$(selEl).append(page);
		$('body').on('change', '.pageCount', function(event) {
			var val = $(this).val();
			var ul = selEl.querySelector('ul');
			// Pagination setup........
			if(val !== '' && $(datatr).length > val) {
				var round = eval(Math.round(datatr.length / val)),
					li = '';
				for (var i = 1; i <= round; i++) {
					li += `<li>${i}</li>`;
				}
				li += '';
				$(ul).html(li);
			} else {
				$(ul).html('');
			}
			// Pagination setup end........
			//pagination machanisum ........
			var li = ul.querySelectorAll('li');
			$(li).each(function(index, el) {
				$(el).on('click', function(event) {
					event.preventDefault();
					var tr = tbody.querySelectorAll('tr.block');
					$(tr).hide();
					$(tr).slice(index*parseInt(val), index*parseInt(val)+parseInt(val)).show();					
				});
			});
			//pagination machanisum end ........
		});
		// pagination end
   });
}