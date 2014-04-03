(function($){

	var methods = {
		init: function(options) {
			var p = $.extend({
				items: 1,
				itemsOnPage: 1,
				pages: 0,
				displayedPages: 5,
				edges: 2,
				currentPage: 1,
				hrefTextPrefix: '#page',
				hrefTextSuffix: '',
				prevText: 'Précédent',
				nextText: 'Suivant',
				ellipseText: '&hellip;',
				cssStyle: '',
				labelMap: [],
				selectOnClick: true,
				nextAtFront: false,
				onPageClick: function(pageNumber, event) {
					// Callback déclenché au clic sur une page
					// Page number est donné comme un paramètre optionnel
				},
				onInit: function() {
					// Callback déclenché à l'initialisation
				}
			}, options || {});

			var self = this;

			p.pages = p.pages ? p.pages : Math.ceil(p.items / p.itemsOnPage) ? Math.ceil(p.items / p.itemsOnPage) : 1;
			p.currentPage = p.currentPage - 1;
			p.halfDisplayed = p.displayedPages / 2;

			this.each(function() {
				self.addClass(p.cssStyle + ' simple-pagination').data('pagination', p);
				methods._draw.call(self);
			});

			p.onInit();

			return this;
		},

		selectPage: function(page) {
			methods._selectPage.call(this, page - 1);
			return this;
		},

		prevPage: function() {
			var p = this.data('pagination');
			if (p.currentPage > 0) {
				methods._selectPage.call(this, p.currentPage - 1);
			}
			return this;
		},

		nextPage: function() {
			var p = this.data('pagination');
			if (p.currentPage < p.pages - 1) {
				methods._selectPage.call(this, p.currentPage + 1);
			}
			return this;
		},

		getPagesCount: function() {
			return this.data('pagination').pages;
		},

		getCurrentPage: function () {
			return this.data('pagination').currentPage + 1;
		},

		destroy: function(){
			this.empty();
			return this;
		},

		drawPage: function (page) {
			var p = this.data('pagination');
			p.currentPage = page - 1;
			this.data('pagination', p);
			methods._draw.call(this);
			return this;
		},

		redraw: function(){
			methods._draw.call(this);
			return this;
		},

		disable: function(){
			var p = this.data('pagination');
			p.disabled = true;
			this.data('pagination', p);
			methods._draw.call(this);
			return this;
		},

		enable: function(){
			var p = this.data('pagination');
			p.disabled = false;
			this.data('pagination', p);
			methods._draw.call(this);
			return this;
		},

		updateItems: function (newItems) {
			var p = this.data('pagination');
			p.items = newItems;
			p.pages = methods._getPages(p);
			this.data('pagination', p);
			methods._draw.call(this);
		},

		updateItemsOnPage: function (itemsOnPage) {
			var p = this.data('pagination');
			p.itemsOnPage = itemsOnPage;
			p.pages = methods._getPages(p);
			this.data('pagination', p);
			methods._selectPage.call(this, 0);
			return this;
		},

		_draw: function() {
			var	p = this.data('pagination'),
				interval = methods._getInterval(p),
				i,
				tagName;

			methods.destroy.call(this);

			tagName = (typeof this.prop === 'function') ? this.prop('tagName') : this.attr('tagName');

			var $panel = tagName === 'UL' ? this : $('<ul></ul>').appendTo(this);

			// Lien "Précédent"
			if (p.prevText) {
				methods._appendItem.call(this, p.currentPage - 1, {text: p.prevText, classes: 'prev'});
			}

			// Lien "Suivant" (avec option at front)
			if (p.nextText && p.nextAtFront) {
				methods._appendItem.call(this, p.currentPage + 1, {text: p.nextText, classes: 'next'});
			}

			// Pages de départ
			if (interval.start > 0 && p.edges > 0) {
				var end = Math.min(p.edges, interval.start);
				for (i = 0; i < end; i++) {
					methods._appendItem.call(this, i);
				}
				if (p.edges < interval.start && (interval.start - p.edges != 1)) {
					$panel.append('<li class="disabled"><span class="ellipse">' + p.ellipseText + '</span></li>');
				} else if (interval.start - p.edges == 1) {
					methods._appendItem.call(this, p.edges);
				}
			}

			// Intervalle
			for (i = interval.start; i < interval.end; i++) {
				methods._appendItem.call(this, i);
			}

			// Pages de fin
			if (interval.end < p.pages && p.edges > 0) {
				if (p.pages - p.edges > interval.end && (p.pages - p.edges - interval.end != 1)) {
					$panel.append('<li class="disabled"><span class="ellipse">' + p.ellipseText + '</span></li>');
				} else if (p.pages - p.edges - interval.end == 1) {
					methods._appendItem.call(this, interval.end++);
				}
				var begin = Math.max(p.pages - p.edges, interval.end);
				for (i = begin; i < p.pages; i++) {
					methods._appendItem.call(this, i);
				}
			}

			// Lien "Suivant" (sans option at front)
			if (p.nextText && !p.nextAtFront) {
				methods._appendItem.call(this, p.currentPage + 1, {text: p.nextText, classes: 'next'});
			}
		},

		_getPages: function(p) {
			var pages = Math.ceil(p.items / p.itemsOnPage);
			return pages || 1;
		},

		_getInterval: function(p) {
			return {
				start: Math.ceil(p.currentPage > p.halfDisplayed ? Math.max(Math.min(p.currentPage - p.halfDisplayed, (p.pages - p.displayedPages)), 0) : 0),
				end: Math.ceil(p.currentPage > p.halfDisplayed ? Math.min(p.currentPage + p.halfDisplayed, p.pages) : Math.min(p.displayedPages, p.pages))
			};
		},

		_appendItem: function(pageIndex, opts) {
			var self = this, options, $link, p = self.data('pagination'), $linkWrapper = $('<li></li>'), $ul = self.find('ul');

			pageIndex = pageIndex < 0 ? 0 : (pageIndex < p.pages ? pageIndex : p.pages - 1);

			options = {
				text: pageIndex + 1,
				classes: ''
			};

			if (p.labelMap.length && p.labelMap[pageIndex]) {
				options.text = p.labelMap[pageIndex];
			}

			options = $.extend(options, opts || {});

			if (pageIndex == p.currentPage || p.disabled) {
				if (p.disabled) {
					$linkWrapper.addClass('disabled');
				} else {
					$linkWrapper.addClass('active');
				}
				$link = $('<span class="tiny button disabled current">' + (options.text) + '</span>');
			} else {
				$link = $('<a href="' + p.hrefTextPrefix + (pageIndex + 1) + p.hrefTextSuffix + '" class="tiny button page-link">' + (options.text) + '</a>');
				$link.click(function(event){
					return methods._selectPage.call(self, pageIndex, event);
				});
			}

			if (options.classes) {
				$link.addClass(options.classes);
			}

			$linkWrapper.append($link);

			if ($ul.length) {
				$ul.append($linkWrapper);
			} else {
				self.append($linkWrapper);
			}
		},

		_selectPage: function(pageIndex, event) {
			var p = this.data('pagination');
			p.currentPage = pageIndex;
			if (p.selectOnClick) {
				methods._draw.call(this);
			}
			return p.onPageClick(pageIndex + 1, event);
		}

	};

	$.fn.pagination = function(method) {

		// Méthode d'appel logique
		if (methods[method] && method.charAt(0) != '_') {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('La méthode ' +  method + ' n\'existe pas.');
		}

	};

})(jQuery);