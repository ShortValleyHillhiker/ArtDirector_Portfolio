const contentData = {
  work: [],
  blog: []
};

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
  renderWorkPreviews();
  renderBlogPreviews();
}

function renderWorkPreviews() {
  const workGrid = document.querySelector('.work-grid');
  if (!workGrid || !contentData.work.length) return;
  
  const workHTML = contentData.work.map(item => `
    <article data-id="${item.id}">
      <h3>${item.title}</h3>
      <p>${item.customer}</p>
      <div>
        ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
    </article>
  `).join('');
  
  workGrid.innerHTML = workHTML;
  
  document.querySelectorAll('.work-grid article').forEach(preview => {
    preview.addEventListener('click', () => loadProject(preview.dataset.id));
  });
}

function renderBlogPreviews() {
  const blogGrid = document.querySelector('.blog-grid');
  if (!blogGrid || !contentData.blog.length) return;
  
  const blogHTML = contentData.blog.map(item => `
    <article data-id="${item.id}">
      <h4>${item.title}</h4>
      <p>${item.description}</p>
      <time>${item.date}</time>
    </article>
  `).join('');
  
  blogGrid.innerHTML = blogHTML;
  
  document.querySelectorAll('.blog-grid article').forEach(preview => {
    preview.addEventListener('click', () => loadBlogPost(preview.dataset.id));
  });
}

async function loadProject(id) {
  try {
    const response = await fetch(`data/work/${id}.html`);
    const html = await response.text();
    
    document.querySelector('.overlay-content').innerHTML = html;
    document.body.classList.add('overlay-active');
    
    history.pushState({ type: 'project', id }, '', `/${id}`);
  } catch (error) {
    console.error('Failed to load project:', error);
  }
}

async function loadBlogPost(id) {
  try {
    const response = await fetch(`data/blog/${id}.html`);
    const html = await response.text();
    
    document.querySelector('.overlay-content').innerHTML = html;
    document.body.classList.add('overlay-active');
    
    history.pushState({ type: 'blog', id }, '', `/${id}`);
  } catch (error) {
    console.error('Failed to load blog post:', error);
  }
}

function handleRoute() {
  const path = window.location.pathname.replace(/^\//, '');
  const hash = window.location.hash;
  
  if (path && contentData.work.some(item => item.id === path)) {
    loadProject(path);
    return;
  }
  
  if (path && contentData.blog.some(item => item.id === path)) {
    loadBlogPost(path);
    return;
  }
  
  if (hash) {
    const section = document.querySelector(hash);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

window.addEventListener('popstate', (e) => {
  if (e.state) {
    if (e.state.type === 'project') {
      loadProject(e.state.id);
    } else if (e.state.type === 'blog') {
      loadBlogPost(e.state.id);
    }
  } else {
    document.body.classList.remove('overlay-active');
  }
});

loadContent();