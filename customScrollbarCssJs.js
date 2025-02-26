var customScrollbarCssJs = (function () {
    class customScrollbarCssJs {
        constructor(selector, options = {}) {
            this.selector = selector;
            this.elements = document.querySelectorAll(this.selector);
            this.startY = 0;
            this.startX = 0;
            this.startTop = 0;
            this.startLeft = 0;
            this.scrollbars = [];
            this.scrollbarDirection = options.scrollbarDirection && options.scrollbarDirection=='horizontal' ? 'horizontal' : 'vertical';
            this.scrollbarPosX = options.scrollbarPosX && options.scrollbarPosX=='left' ? 'left' : 'right';
            this.scrollbarPosY = options.scrollbarPosY && options.scrollbarPosY=='top' ? 'top' : 'bottom';
            this.scrollbarClass = options.scrollbarClass ? options.scrollbarClass : '';
            this.alwaysVisible = options.alwaysVisible && options.alwaysVisible=='true' ? true : false;

            this.init();
        }

        // create scrollbar container
        createCustomScrollbarCssJs(element) {
            const scrollbarContent = document.createElement('div');
            scrollbarContent.classList.add('custom-scrollbar-content');
            scrollbarContent.innerHTML = element.innerHTML;
            element.innerHTML = "";
            element.appendChild(scrollbarContent);
            
            const scrollbarEl = document.createElement('div');
            scrollbarEl.classList.add('custom-scrollbar');
            this.scrollbarClass ? scrollbarEl.classList.add(this.scrollbarClass) : '';
            const thumb = document.createElement('div');
            thumb.classList.add('scroll-thumb');
            
            scrollbarEl.appendChild(thumb);
            element.appendChild(scrollbarEl);
            
            this.scrollbars.push({
                scrollbarContent: scrollbarContent,
                scrollThumb: thumb,
                scrollbar: scrollbarEl,
                element: element
            });

            let showScrollbar = '';
            let padding = 0;

            // css styles and classes
            element.classList.add('custom-scrollbar-' + this.scrollbarPosX);
            element.classList.add('custom-scrollbar-' + this.scrollbarPosY);
            element.classList.add('custom-scrollbar-' + this.scrollbarDirection);
            if(this.scrollbarDirection=='horizontal') {
                showScrollbar = (scrollbarContent.scrollWidth>element.offsetWidth || this.alwaysVisible) ? true : false;
                requestAnimationFrame(() => {
                    padding = (scrollbarEl.offsetHeight>=thumb.offsetHeight) ? scrollbarEl.offsetHeight : thumb.offsetHeight;
                    if(this.scrollbarPosY=='top') {
                        showScrollbar ? scrollbarContent.style.paddingTop+=`${padding}px` : scrollbarEl.style.display = 'none';
                    }
                    else {
                        showScrollbar ? scrollbarContent.style.paddingBottom+=`${padding}px` : scrollbarEl.style.display = 'none';
                    }
                });
            }
            else {
                showScrollbar = (scrollbarContent.scrollHeight>element.offsetHeight || this.alwaysVisible) ? true : false;
                requestAnimationFrame(() => {
                    padding = (scrollbarEl.offsetWidth>=thumb.offsetWidth) ? scrollbarEl.offsetWidth : thumb.offsetWidth;
                    if(this.scrollbarPosX=='right') {
                        showScrollbar ? scrollbarContent.style.paddingRight+=`${padding}px` : scrollbarEl.style.display = 'none';
                    }
                    else {
                        showScrollbar ? scrollbarContent.style.paddingLeft+=`${padding}px` : scrollbarEl.style.display = 'none';
                    }
                });
            }
        }

        onMouseMove = (e, scrollbarContent, scrollbar, scrollThumb, element) => {
            if (!scrollThumb || !scrollbar || !element || !scrollbarContent) return;

            const deltaY = e.clientY - this.startY;
            const deltaX = e.clientX - this.startX;
            const scrollbarHeight = scrollbar.clientHeight - scrollThumb.clientHeight;
            const scrollbarWidth = scrollbar.clientWidth - scrollThumb.clientWidth;
            const newTop = Math.min(Math.max(0, this.startTop + deltaY), scrollbarHeight); 
            const newLeft = Math.min(Math.max(0, this.startLeft + deltaX), scrollbarWidth);

            if(this.scrollbarDirection=='horizontal') {
                scrollThumb.style.left = `${newLeft}px`;
                // Calculate the content's scroll position based on thumb's new position
                const contentScrollWidth = scrollbarContent.scrollWidth - scrollbarContent.clientWidth;
                scrollbarContent.scrollLeft = (newLeft / scrollbarWidth) * contentScrollWidth; // Update content scroll position
            }
            else {
                scrollThumb.style.top = `${newTop}px`;
                // Calculate the content's scroll position based on thumb's new position
                const contentScrollHeight = scrollbarContent.scrollHeight - scrollbarContent.clientHeight;
                scrollbarContent.scrollTop = (newTop / scrollbarHeight) * contentScrollHeight; // Update content scroll position
            }
        }

        onMouseUp = (e) => {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }

        init() {
            this.elements.forEach(element => {
                this.createCustomScrollbarCssJs(element);
            });
            
            this.scrollbars.forEach(({ scrollbarContent, scrollbar, scrollThumb, element }) => {
                if (!scrollbar || !scrollThumb || !scrollbarContent) {
                    return;
                }
                // Sync the thumb's position with the content scroll when the content scrolls
                scrollbarContent.addEventListener('scroll', () => {
                    const contentScrollHeight = scrollbarContent.scrollHeight - scrollbarContent.clientHeight;
                    const scrollbarHeight = scrollbar.clientHeight - scrollThumb.clientHeight;
                    const contentScrollWidth = scrollbarContent.scrollWidth - scrollbarContent.clientWidth;
                    const scrollbarWidth = scrollbar.clientWidth - scrollThumb.clientWidth;
                    if(this.scrollbarDirection=='horizontal') {
                        const scrollRatio = scrollbarContent.scrollLeft / contentScrollWidth;
                        scrollThumb.style.left = `${scrollRatio * scrollbarWidth}px`;
                    }
                    else {
                        const scrollRatio = scrollbarContent.scrollTop / contentScrollHeight;
                        scrollThumb.style.top = `${scrollRatio * scrollbarHeight}px`;
                    }
                });

                // Allow dragging of the custom scrollbar
                scrollThumb.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.startY = e.clientY;
                    this.startX = e.clientX;
                    this.startTop = parseInt(scrollThumb.style.top) || 0;
                    this.startLeft = parseInt(scrollThumb.style.left) || 0;
                    const onMouseMoveHandler = (e) => {
                        this.onMouseMove(e, scrollbarContent, scrollbar, scrollThumb, element);
                    };
                    document.addEventListener('mousemove', onMouseMoveHandler);
                    document.addEventListener('mouseup', () => {
                        this.onMouseUp();
                        document.removeEventListener('mousemove', onMouseMoveHandler);
                    });
                });
            });
        }
    }

    return customScrollbarCssJs;
})();
