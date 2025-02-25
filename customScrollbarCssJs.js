var customScrollbarCssJs = (function () {
    class customScrollbarCssJs {
        constructor(selector, options = {}) {
            this.selector = selector;
            this.element = document.querySelector(this.selector);
            this.startY = 0;
            this.startX = 0;
            this.startTop = 0;
            this.startLeft = 0;
            this.scrollbar = null;
            this.scrollThumb = null;
            this.scrollbarContent = null;
            this.scrollbarDirection = options.scrollbarDirection && options.scrollbarDirection=='horizontal' ? 'horizontal' : 'vertical';
            this.scrollbarPosX = options.scrollbarPosX && options.scrollbarPosX=='left' ? 'left' : 'right';
            this.scrollbarPosY = options.scrollbarPosY && options.scrollbarPosY=='top' ? 'top' : 'bottom';
            this.scrollbarClass = options.scrollbarClass ? options.scrollbarClass : '';
            this.alwaysVisible = options.alwaysVisible && options.alwaysVisible=='true' ? true : false;

            this.init();
        }

        // create scrollbar container
        createCustomScrollbarCssJs() {
            const scrollbarContent = document.createElement('div');
            scrollbarContent.classList.add('custom-scrollbar-content');
            scrollbarContent.innerHTML = this.element.innerHTML;
            this.element.innerHTML = "";
            this.element.appendChild(scrollbarContent);
            
            const scrollbarEl = document.createElement('div');
            scrollbarEl.classList.add('custom-scrollbar');
            this.scrollbarClass ? scrollbarEl.classList.add(this.scrollbarClass) : '';
            const thumb = document.createElement('div');
            thumb.classList.add('scroll-thumb');
            
            scrollbarEl.appendChild(thumb);
            this.element.appendChild(scrollbarEl);
            
            this.scrollbarContent = scrollbarContent;
            this.scrollbar = scrollbarEl;
            this.scrollThumb = thumb;
            let showScrollbar = '';
            let padding = 0;

            // css styles and classes
            this.element.classList.add('custom-scrollbar-' + this.scrollbarPosX);
            this.element.classList.add('custom-scrollbar-' + this.scrollbarPosY);
            this.element.classList.add('custom-scrollbar-' + this.scrollbarDirection);
            if(this.scrollbarDirection=='horizontal') {
                showScrollbar = (this.scrollbarContent.scrollWidth>this.element.offsetWidth || this.alwaysVisible) ? true : false;
                requestAnimationFrame(() => {
                    padding = (this.scrollbar.offsetHeight>=this.scrollThumb.offsetHeight) ? this.scrollbar.offsetHeight : this.scrollThumb.offsetHeight;
                    if(this.scrollbarPosY=='top') {
                        showScrollbar ? this.scrollbarContent.style.paddingTop+=`${padding}px` : this.scrollbar.style.display = 'none';
                    }
                    else {
                        showScrollbar ? this.scrollbarContent.style.paddingBottom+=`${padding}px` : this.scrollbar.style.display = 'none';
                    }
                });
            }
            else {
                showScrollbar = (this.scrollbarContent.scrollHeight>this.element.offsetHeight || this.alwaysVisible) ? true : false;
                requestAnimationFrame(() => {
                    padding = (this.scrollbar.offsetWidth>=this.scrollThumb.offsetWidth) ? this.scrollbar.offsetWidth : this.scrollThumb.offsetWidth;
                    if(this.scrollbarPosX=='right') {
                        showScrollbar ? this.scrollbarContent.style.paddingRight+=`${padding}px` : this.scrollbar.style.display = 'none';
                    }
                    else {
                        showScrollbar ? this.scrollbarContent.style.paddingLeft+=`${padding}px` : this.scrollbar.style.display = 'none';
                    }
                });
            }
        }

        onMouseMove = (e) => {
            if (!this.scrollThumb || !this.scrollbar || !this.element || !this.scrollbarContent) return;

            const deltaY = e.clientY - this.startY;
            const deltaX = e.clientX - this.startX;
            const scrollbarHeight = this.scrollbar.clientHeight - this.scrollThumb.clientHeight;
            const scrollbarWidth = this.scrollbar.clientWidth - this.scrollThumb.clientWidth;
            const newTop = Math.min(Math.max(0, this.startTop + deltaY), scrollbarHeight); 
            const newLeft = Math.min(Math.max(0, this.startLeft + deltaX), scrollbarWidth);

            if(this.scrollbarDirection=='horizontal') {
                this.scrollThumb.style.left = `${newLeft}px`;
                // Calculate the content's scroll position based on thumb's new position
                const contentScrollWidth = this.scrollbarContent.scrollWidth - this.scrollbarContent.clientWidth;
                this.scrollbarContent.scrollLeft = (newLeft / scrollbarWidth) * contentScrollWidth; // Update content scroll position
            }
            else {
                this.scrollThumb.style.top = `${newTop}px`;
                // Calculate the content's scroll position based on thumb's new position
                const contentScrollHeight = this.scrollbarContent.scrollHeight - this.scrollbarContent.clientHeight;
                this.scrollbarContent.scrollTop = (newTop / scrollbarHeight) * contentScrollHeight; // Update content scroll position
            }
        }

        onMouseUp = () => {
            document.removeEventListener('mousemove', this.onMouseMove);
            document.removeEventListener('mouseup', this.onMouseUp);
        }

        init() {
            this.createCustomScrollbarCssJs();

            if (!this.scrollbar || !this.scrollThumb) {
                console.error('Scrollbar or Scroll Thumb not found.');
                return;
            }

            // Sync the thumb's position with the content scroll when the content scrolls
            this.scrollbarContent.addEventListener('scroll', () => {
                const contentScrollHeight = this.scrollbarContent.scrollHeight - this.scrollbarContent.clientHeight;
                const scrollbarHeight = this.scrollbar.clientHeight - this.scrollThumb.clientHeight;
                const contentScrollWidth = this.scrollbarContent.scrollWidth - this.scrollbarContent.clientWidth;
                const scrollbarWidth = this.scrollbar.clientWidth - this.scrollThumb.clientWidth;
                if(this.scrollbarDirection=='horizontal') {
                    const scrollRatio = this.scrollbarContent.scrollLeft / contentScrollWidth;
                    this.scrollThumb.style.left = `${scrollRatio * scrollbarWidth}px`;
                }
                else {
                    const scrollRatio = this.scrollbarContent.scrollTop / contentScrollHeight;
                    this.scrollThumb.style.top = `${scrollRatio * scrollbarHeight}px`;
                }
            });

            // Allow dragging of the custom scrollbar
            this.scrollThumb.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.startY = e.clientY;
                this.startX = e.clientX;
                this.startTop = parseInt(this.scrollThumb.style.top) || 0;
                this.startLeft = parseInt(this.scrollThumb.style.left) || 0;

                document.addEventListener('mousemove', this.onMouseMove);
                document.addEventListener('mouseup', this.onMouseUp);
            });
        }
    }

    return customScrollbarCssJs;
})();
