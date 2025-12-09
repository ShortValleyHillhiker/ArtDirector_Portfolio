const contentData = {
  work: [],
  blog: []
};

const lazyLoadConfig = {
  work: { initial: 4, increment: 4, currentIndex: 0 },
  blog: { initial: 10, increment: 4, currentIndex: 0 }
};

// Single intersection observer instance shared across all articles
const articleObserver = new IntersectionObserver((entries) => {
  const queue = entries.filter(e => e.isIntersecting && e.target.classList.contains('hidden'));
  
  queue.forEach((entry, i) => {
    setTimeout(() => {
      entry.target.classList.remove('hidden');
      articleObserver.unobserve(entry.target);
    }, i * 50);
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
});

async function loadContent() {
  try {
    const response = await fetch('data/content.json');
    const data = await response.json();
    contentData.work = data.work || [];
    contentData.blog = data.blog || [];
    
    renderPreviews();
    handleRoute();
  } catch (error) {
    console.error('Failed to load content:', error);
  }
}

function renderPreviews() {
  lazyLoadConfig.work.currentIndex = 0;
  lazyLoadConfig.blog.currentIndex = 0;
  renderContent('work', true);
  renderContent('blog', true);
}

function renderContent(type, isInitial = false) {
  const grid = document.querySelector(`.${type}-grid`);
  if (!grid || !contentData[type].length) return;
  
  const config = lazyLoadConfig[type];
  const itemsToLoad = isInitial ? config.initial : config.increment;
  const startIndex = config.currentIndex;
  const endIndex = Math.min(startIndex + itemsToLoad, contentData[type].length);
  const items = contentData[type].slice(startIndex, endIndex);
  
  const html = items.map(item => 
    type === 'work' ? createWorkHTML(item) : createBlogHTML(item)
  ).join('');
  
  if (isInitial) {
    grid.innerHTML = html;
  } else {
    grid.querySelector(`.load-more-${type}`)?.remove();
    grid.insertAdjacentHTML('beforeend', html);
  }
  
  config.currentIndex = endIndex;
  
  // Attach listeners only to new articles
  const newArticles = grid.querySelectorAll('article:not([data-has-listener])');
  const loadFn = type === 'work' ? loadProject : loadBlogPost;
  
  newArticles.forEach(article => {
    article.addEventListener('click', () => loadFn(article.dataset.id));
    article.dataset.hasListener = 'true';
    if (article.classList.contains('hidden')) {
      articleObserver.observe(article);
    }
  });
  
  updateLoadMoreButton(type);
}

function createWorkHTML(item) {
  return `
    <article class="work-preview hidden" data-id="${item.id}">
      <div class="img-wrapper">
        ${item.image ? `<img src="${item.image}" alt="${item.title}">` : ''}
      </div>
      <div class="work-preview_content">
        <div class="work-info">
          <p>${item.title}</p>
          <p>${item.customer}</p>
        </div>
        <p class="work-tags">${item.tags.join(', ')}</p>
      </div>
    </article>`;
}

function createBlogHTML(item) {
  return `
    <article class="blog-preview hidden" data-id="${item.id}">
      <div class="blog-preview_content">
        <small>${item.date}</small>
        <h5>${item.title}</h5>
      </div>
      <div class="btn">Läs mer</div>
    </article>`;
}

function updateLoadMoreButton(type) {
  const grid = document.querySelector(`.${type}-grid`);
  if (!grid) return;
  
  const config = lazyLoadConfig[type];
  const hasMore = config.currentIndex < contentData[type].length;
  let btn = grid.querySelector(`.load-more-${type}`);
  
  if (hasMore && !btn) {
    btn = document.createElement('div');
    btn.className = `btn load-more-${type}`;
    btn.textContent = 'Ladda fler';
    btn.addEventListener('click', () => renderContent(type, false));
    grid.appendChild(btn);
  } else if (!hasMore && btn) {
    btn.remove();
  }
}

async function loadOverlay(type, id) {
  try {
    const response = await fetch(`data/${type}/${id}.html`);
    const html = await response.text();
    
    document.querySelector('.overlay-content').innerHTML = html;
    document.body.classList.add('overlay-active');
    
    history.pushState({ type, id }, '', `/${id}`);
  } catch (error) {
    console.error(`Failed to load ${type}:`, error);
  }
}

const loadProject = (id) => loadOverlay('work', id);
const loadBlogPost = (id) => loadOverlay('blog', id);

function handleRoute() {
  const path = window.location.pathname.replace(/^\//, '');
  const hash = window.location.hash;
  
  if (path) {
    if (contentData.work.some(item => item.id === path)) {
      loadProject(path);
      return;
    }
    if (contentData.blog.some(item => item.id === path)) {
      loadBlogPost(path);
      return;
    }
  }
  
  if (hash) {
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
  }
}

window.addEventListener('popstate', (e) => {
  if (e.state?.type) {
    (e.state.type === 'project' ? loadProject : loadBlogPost)(e.state.id);
  } else {
    document.body.classList.remove('overlay-active');
  }
});

loadContent();