export const ContentRenderer = {
    renderTitle(data) {
        if (!data?.title) return null;

        const titleWrapper = document.createElement('div');
        titleWrapper.className = 'content-title';

        if (data.type === 'blog') {
            titleWrapper.innerHTML = `
            <time datetime="${data.date || ''}">${data.date ? new Date(data.date).toLocaleDateString('sv-SE', { day: 'numeric', month: 'short', year: 'numeric' }) : ''}</time>
            <p class="blog-heading">${data.title}</p>
        `;
        } else {
            titleWrapper.innerHTML = `
            <p class="work-heading">${data.title}</p>
            ${data.client ? `<p class="work-client"><span>${data.client}</span></p>` : ''}
        `;
        }

        return titleWrapper;
    },

    renderImage(data) {
        if (!data?.src) return null;

        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'content-image';
        if (data.aspectRatio) {
            imageWrapper.style.aspectRatio = data.aspectRatio;
        }
        imageWrapper.innerHTML = `<img src="${data.src}" alt="${data.alt || ''}">`;
        return imageWrapper;
    },

    renderVideo(data) {
        if (!data?.src) return null;

        const videoWrapper = document.createElement('div');
        videoWrapper.className = 'content-video';
        if (data.aspectRatio) {
            videoWrapper.style.aspectRatio = data.aspectRatio;
        }
        videoWrapper.innerHTML = `<video src="${data.src}" autoplay muted loop></video>`;
        return videoWrapper;
    },

    renderVimeo(data) {
        if (!data?.embedUrl) return null;

        const vimeoWrapper = document.createElement('div');
        vimeoWrapper.className = 'content-vimeo';
        if (data.aspectRatio) {
            vimeoWrapper.style.aspectRatio = data.aspectRatio;
        }
        vimeoWrapper.innerHTML = `<iframe src="${data.embedUrl}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
        return vimeoWrapper;
    },

    renderGallery(data) {
        if (!data?.items?.length) return null;

        const gallery = document.createElement('div');
        gallery.className = 'content-gallery';

        data.items.forEach(item => {
            const element = this.renderBlock(item);
            if (element) gallery.appendChild(element);
        });

        return gallery;
    },

    renderParagraph(data) {
        if (!data?.paragraphs?.length) return null;

        const paragraphWrapper = document.createElement('div');
        paragraphWrapper.className = 'content-paragraph';

        data.paragraphs.forEach((text, index) => {
            const p = document.createElement('p');
            if (index === 0 && data.hasPreamble) {
                p.className = 'content-preamble';
            }
            p.textContent = text;
            paragraphWrapper.appendChild(p);
        });

        return paragraphWrapper;
    },

    renderBrief(data) {
        if (!data?.sections?.length) return null;

        const briefWrapper = document.createElement('div');
        briefWrapper.className = 'content-brief';

        data.sections.forEach(section => {
            const span = document.createElement('span');
            span.innerHTML = `
                <p>${section.label}:</p>
                <p>${section.text}</p>
            `;
            briefWrapper.appendChild(span);
        });

        return briefWrapper;
    },

    renderQuote(data) {
        if (!data?.quote) return null;

        const quoteWrapper = document.createElement('div');
        quoteWrapper.className = 'content-quote';
        quoteWrapper.innerHTML = `
            <p>"${data.quote}"</p>
            <p>${data.author}${data.title ? `,<span>${data.title}</span>` : ''}</p>
        `;
        return quoteWrapper;
    },

    renderBlock(block) {
        switch (block.type) {
            case 'image':
                return this.renderImage(block);
            case 'video':
                return this.renderVideo(block);
            case 'vimeo':
                return this.renderVimeo(block);
            case 'gallery':
                return this.renderGallery(block);
            case 'paragraph':
                return this.renderParagraph(block);
            case 'brief':
                return this.renderBrief(block);
            case 'quote':
                return this.renderQuote(block);
            default:
                return null;
        }
    },

    render(postData) {
        const fragment = document.createDocumentFragment();

        const title = this.renderTitle(postData);
        if (title) fragment.appendChild(title);

        postData.content?.forEach(block => {
            const element = this.renderBlock(block);
            if (element) fragment.appendChild(element);
        });

        return fragment;
    }
};