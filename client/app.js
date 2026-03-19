// API Configuration
const API_BASE_URL = '/api';

// State
let currentUser = null;
let currentPage = 'feed';
let avatarRemoved = false;
let allUsers = [];

// Utility functions for avatars
function getInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function generateAvatarDataURL(name) {
  const initials = getInitials(name);
  const svg = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect width="200" height="200" fill="#e8a5c7" /><text x="50%" y="55%" font-family="Arial, Helvetica, sans-serif" font-size="90" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function getAvatarURL(user) {
  const avatar = user?.avatar;
  const isValidUrl = typeof avatar === 'string' && (avatar.startsWith('http') || avatar.startsWith('data:'));
  const isPlaceholder = typeof avatar === 'string' && avatar.includes('via.placeholder.com');

  if (isValidUrl && !isPlaceholder) {
    return avatar;
  }

  // Generate a safe inline avatar
  const name = (user && user.username) ? user.username : 'User';
  return generateAvatarDataURL(name);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    initApp();
  } else {
    showAuthSection();
  }
});

// Notification toast
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===========================
// AUTH FUNCTIONS
// ===========================
function switchForm(form) {
  document.querySelectorAll('.auth-form').forEach((f) => {
    f.classList.remove('active');
  });
  
  if (form === 'login') {
    document.getElementById('loginForm').classList.add('active');
  } else {
    document.getElementById('signupForm').classList.add('active');
  }
}

document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      initApp();
    } else {
      alert(data.message || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('An error occurred. Please try again.');
  }
});

document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const username = document.getElementById('signupUsername').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      initApp();
    } else {
      alert(data.message || 'Registration failed');
    }
  } catch (error) {
    console.error('Signup error:', error);
    alert('An error occurred. Please try again.');
  }
});

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  showAuthSection();
}

function showAuthSection() {
  document.getElementById('authSection').style.display = 'flex';
  document.getElementById('appSection').style.display = 'none';
  switchForm('login');
}

// ===========================
// APP INITIALIZATION
// ===========================
async function initApp() {
  document.getElementById('authSection').style.display = 'none';
  document.getElementById('appSection').style.display = 'flex';
  
  const userData = JSON.parse(localStorage.getItem('user'));
  currentUser = userData;
  
  // Set default avatar (fallback to generated SVG in case of load errors)
  const creatorAvatar = document.getElementById('creatorAvatar');
  creatorAvatar.src = getAvatarURL(currentUser);
  creatorAvatar.onerror = () => {
    creatorAvatar.onerror = null;
    creatorAvatar.src = generateAvatarDataURL(currentUser?.username || 'User');
  };

  // Load initial data
  loadFeed();
  loadProfile();
}

// ===========================
// PAGE NAVIGATION
// ===========================
function switchPage(page) {
  currentPage = page;
  
  // Update active nav item
  document.querySelectorAll('.nav-item').forEach((item) => {
    item.classList.remove('active');
  });
  document.querySelector(`[onclick="switchPage('${page}')"]`)?.classList.add('active');
  
  // Update active page
  document.querySelectorAll('.page').forEach((p) => {
    p.classList.remove('active');
  });
  
  if (page === 'feed') {
    document.getElementById('feedPage').classList.add('active');
    loadFeed();
  } else if (page === 'profile') {
    document.getElementById('profilePage').classList.add('active');
    loadProfile();
  } else if (page === 'explore') {
    document.getElementById('explorePage').classList.add('active');
    loadUsers();
  } else if (page === 'notifications') {
    document.getElementById('notificationsPage').classList.add('active');
    loadNotifications();
  }
}

// ===========================
// FEED FUNCTIONS
// ===========================
async function loadFeed() {
  try {
    const response = await fetch(`${API_BASE_URL}/posts`);
    const posts = await response.json();
    
    const feedContainer = document.getElementById('feedContainer');
    feedContainer.innerHTML = '';
    
    posts.forEach((post) => {
      feedContainer.appendChild(createPostElement(post));
    });
  } catch (error) {
    console.error('Error loading feed:', error);
  }
}

function expandPostCreator() {
  document.getElementById('postCreatorExpanded').style.display = 'block';
  document.getElementById('postContentExpanded').focus();
}

function cancelPost() {
  document.getElementById('postCreatorExpanded').style.display = 'none';
  document.getElementById('postContent').value = '';
  document.getElementById('postContentExpanded').value = '';
}

async function createPost() {
  const content = document.getElementById('postContentExpanded').value;
  
  if (!content.trim()) {
    alert('Please enter some content');
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ content })
    });
    
    if (response.ok) {
      cancelPost();
      loadFeed();
    } else {
      alert('Failed to create post');
    }
  } catch (error) {
    console.error('Error creating post:', error);
    alert('An error occurred');
  }
}

function createPostElement(post) {
  const postDiv = document.createElement('div');
  postDiv.className = 'post';
  postDiv.innerHTML = `
    <div class="post-header">
      <img src="${getAvatarURL(post.author)}" alt="Avatar" onerror="this.onerror=null; this.src=getAvatarURL({username: '${post.author.username}'});" />
      <div class="post-meta">
        <div class="post-author">${post.author.username}</div>
        <div class="post-time">${new Date(post.createdAt).toLocaleDateString()}</div>
      </div>
      ${post.author._id === currentUser.id ? `<button class="post-delete" onclick="deletePost('${post._id}')">Delete</button>` : ''}
    </div>
    <div class="post-content" onclick="openPostModal('${post._id}')">${post.content}</div>
    ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image" />` : ''}
    <div class="post-actions">
      <button class="action-btn ${post.likes.includes(currentUser.id) ? 'liked' : ''}" onclick="toggleLike('${post._id}', this)">
        <span>${post.likes.includes(currentUser.id) ? '❤️' : '🤍'}</span>
        <span>${post.likes.length}</span>
      </button>
      <button class="action-btn" onclick="openPostModal('${post._id}')">
        <span>💬</span>
        <span>${post.comments.length}</span>
      </button>
    </div>
  `;
  
  return postDiv;
}

async function toggleLike(postId, button) {
  try {
    const isLiked = button.classList.contains('liked');
    const endpoint = isLiked ? 'unlike' : 'like';
    
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      button.classList.toggle('liked');
      button.querySelector('span:first-child').textContent = isLiked ? '🤍' : '❤️';
      button.querySelector('span:last-child').textContent = data.likeCount;
    }
  } catch (error) {
    console.error('Error toggling like:', error);
  }
}

async function deletePost(postId) {
  if (!confirm('Are you sure you want to delete this post?')) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      loadFeed();
    } else {
      alert('Failed to delete post');
    }
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

// ===========================
// POST DETAIL MODAL
// ===========================
async function openPostModal(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}`);
    const post = await response.json();
    
    const modal = document.getElementById('postModal');
    const detail = document.getElementById('postDetail');
    
    let commentsHTML = '<div class="comments-section"><h3>Comments</h3>';
    
    post.comments.forEach((comment) => {
      commentsHTML += `
        <div class="comment">
          <span class="comment-author">${comment.author.username}</span>
          <div class="comment-text">${comment.content}</div>
        </div>
      `;
    });
    
    commentsHTML += `
      <div class="comment-input">
        <input type="text" id="commentInput" placeholder="Add a comment..." />
        <button onclick="addComment('${postId}')">Post</button>
      </div>
    </div>
    `;
    
    detail.innerHTML = `
      <div class="post">
        <div class="post-header">
          <img src="${getAvatarURL(post.author)}" alt="Avatar" onerror="this.onerror=null; this.src=getAvatarURL({username: '${post.author.username}'});" />
          <div class="post-meta">
            <div class="post-author">${post.author.username}</div>
            <div class="post-time">${new Date(post.createdAt).toLocaleDateString()}</div>
          </div>
        </div>
        <div class="post-content">${post.content}</div>
        ${post.image ? `<img src="${post.image}" alt="Post image" class="post-image" />` : ''}
        <div class="post-actions">
          <button class="action-btn ${post.likes.includes(currentUser.id) ? 'liked' : ''}" onclick="toggleLike('${post._id}', this)">
            <span>${post.likes.includes(currentUser.id) ? '❤️' : '🤍'}</span>
            <span>${post.likes.length}</span>
          </button>
          <button class="action-btn">
            <span>💬</span>
            <span>${post.comments.length}</span>
          </button>
        </div>
      </div>
      ${commentsHTML}
    `;
    
    modal.style.display = 'flex';
  } catch (error) {
    console.error('Error loading post detail:', error);
  }
}

function closePostModal() {
  document.getElementById('postModal').style.display = 'none';
}

async function addComment(postId) {
  const input = document.getElementById('commentInput');
  const content = input.value;
  
  if (!content.trim()) return;
  
  try {
    const response = await fetch(`${API_BASE_URL}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ postId, content })
    });
    
    if (response.ok) {
      input.value = '';
      openPostModal(postId); // Refresh modal
      if (currentPage === 'feed') loadFeed();
    }
  } catch (error) {
    console.error('Error adding comment:', error);
  }
}

// ===========================
// PROFILE FUNCTIONS
// ===========================
async function loadProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/profile/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    const user = await response.json();
    currentUser = { ...currentUser, ...user };
    localStorage.setItem('user', JSON.stringify(currentUser));
    
    document.getElementById('profileUsername').textContent = user.username;
    document.getElementById('profileBio').textContent = user.bio || 'No bio yet';
    const profileAvatar = document.getElementById('profileAvatar');
    const creatorAvatar = document.getElementById('creatorAvatar');

    const avatarUrl = getAvatarURL(user);
    const cacheBustedUrl = avatarUrl.startsWith('data:') ? avatarUrl : `${avatarUrl}?t=${Date.now()}`;

    profileAvatar.src = cacheBustedUrl;
    profileAvatar.onerror = () => {
      profileAvatar.onerror = null;
      profileAvatar.src = generateAvatarDataURL(user.username);
    };

    creatorAvatar.src = cacheBustedUrl;
    creatorAvatar.onerror = () => {
      creatorAvatar.onerror = null;
      creatorAvatar.src = generateAvatarDataURL(user.username);
    };

    document.getElementById('postsCount').textContent = user.posts ? user.posts.length : 0;
    document.getElementById('followersCount').textContent = user.followers.length;
    document.getElementById('followingCount').textContent = user.following.length;
    
    // Load user's posts
    const postsResponse = await fetch(`${API_BASE_URL}/posts/user/${user._id}`);
    const userPosts = await postsResponse.json();
    
    const userPostsContainer = document.getElementById('userPostsContainer');
    userPostsContainer.innerHTML = '';
    
    if (userPosts.length === 0) {
      userPostsContainer.innerHTML = '<p class="loading">No posts yet. Create your first post!</p>';
    } else {
      userPosts.forEach((post) => {
        userPostsContainer.appendChild(createPostElement(post));
      });
    }
  } catch (error) {
    console.error('Error loading profile:', error);
  }
}

function toggleEditProfile() {
  const editForm = document.getElementById('editProfileForm');
  editForm.style.display = editForm.style.display === 'none' ? 'block' : 'none';
  
  if (editForm.style.display === 'block') {
    document.getElementById('editBio').value = currentUser.bio || '';
    document.getElementById('editAvatar').value = currentUser.avatar || '';
    document.getElementById('editAvatarFile').value = '';
    avatarRemoved = false;
  }
}

function clearAvatar() {
  console.log('clearAvatar called');
  document.getElementById('editAvatar').value = '';
  document.getElementById('editAvatarFile').value = '';
  avatarRemoved = true;
  showToast('Profile picture removed');
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function updateProfile() {
  const bio = document.getElementById('editBio').value;
  const avatarUrl = document.getElementById('editAvatar').value;
  const avatarFile = document.getElementById('editAvatarFile').files[0];

  let avatar = avatarUrl;

  if (avatarFile) {
    try {
      avatar = await readFileAsDataURL(avatarFile);
    } catch (err) {
      console.error('Failed to read avatar file:', err);
      showToast('Failed to read the selected image. Please try a different file.');
      return;
    }
  }

  // Treat an empty URL + no file as removing the avatar
  if (avatarRemoved || (!avatarUrl && !avatarFile)) {
    avatar = null;
  }

  try {
    const body = JSON.stringify({ bio, avatar });
    console.log('Updating profile with body:', body, { avatarRemoved, avatarUrl: document.getElementById('editAvatar').value, hasFile: !!document.getElementById('editAvatarFile').files[0] });

    const response = await fetch(`${API_BASE_URL}/users/profile/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body
    });
    
    if (response.ok) {
      toggleEditProfile();
      loadProfile();
      if (avatarRemoved || (!avatarUrl && !avatarFile)) {
        showToast('Profile picture removed');
      }
      avatarRemoved = false;
    } else {
      const errorText = await response.text();
      console.error('Profile update failed:', response.status, errorText);
      showToast(`Failed to update profile (${response.status})`);
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showToast('An error occurred while updating your profile.');
  }
}

// ===========================
// EXPLORE FUNCTIONS
// ===========================
async function loadUsers() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);
    const users = await response.json();
    
    allUsers = users;
    
    const usersContainer = document.getElementById('usersContainer');
    usersContainer.innerHTML = '';
    
    const currentUserId = currentUser?._id || currentUser?.id;
    
    if (!users || users.length === 0) {
      usersContainer.innerHTML = '<p class="loading">No users to explore yet.</p>';
      return;
    }

    let addedUsers = 0;
    users.forEach((user) => {
      if (user._id !== currentUserId) {
        usersContainer.appendChild(createUserCard(user));
        addedUsers++;
      }
    });

    if (addedUsers === 0) {
      usersContainer.innerHTML = '<p class="loading">No other users to explore.</p>';
    }

    // Clear search input when loading users
    const searchInput = document.getElementById('userSearchInput');
    if (searchInput) {
      searchInput.value = '';
    }
  } catch (error) {
    console.error('Error loading users:', error);
    document.getElementById('usersContainer').innerHTML = '<p class="loading">Error loading users.</p>';
  }
}

function searchUsers(query) {
  const usersContainer = document.getElementById('usersContainer');
  usersContainer.innerHTML = '';

  const currentUserId = currentUser?._id || currentUser?.id;
  const searchTerm = query.toLowerCase().trim();

  if (searchTerm === '') {
    // If search is empty, reload all users
    loadUsers();
    return;
  }

  const filteredUsers = allUsers.filter((user) => {
    if (user._id === currentUserId) return false;
    return user.username.toLowerCase().includes(searchTerm) || 
           (user.bio && user.bio.toLowerCase().includes(searchTerm));
  });

  if (filteredUsers.length === 0) {
    usersContainer.innerHTML = '<p class="loading">No users found matching your search.</p>';
    return;
  }

  filteredUsers.forEach((user) => {
    usersContainer.appendChild(createUserCard(user));
  });
}

// ===========================
// NOTIFICATIONS FUNCTIONS
// ===========================
async function loadNotifications() {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      // If notifications endpoint doesn't exist, show empty state
      document.getElementById('notificationsContainer').innerHTML = 
        '<p class="loading">No notifications yet</p>';
      return;
    }

    const notifications = await response.json();
    const container = document.getElementById('notificationsContainer');
    container.innerHTML = '';

    if (!notifications || notifications.length === 0) {
      container.innerHTML = '<p class="loading">No notifications yet</p>';
      return;
    }

    notifications.forEach((notification) => {
      container.appendChild(createNotificationElement(notification));
    });
  } catch (error) {
    console.error('Error loading notifications:', error);
    document.getElementById('notificationsContainer').innerHTML = 
      '<p class="loading">No notifications yet</p>';
  }
}

function createNotificationElement(notification) {
  const div = document.createElement('div');
  div.className = 'notification-item';

  let message = '';
  let icon = '';

  if (notification.type === 'follow') {
    message = `<strong>${notification.fromUser.username}</strong> followed you`;
    icon = '👤';
  } else if (notification.type === 'like') {
    message = `<strong>${notification.fromUser.username}</strong> liked your post`;
    icon = '❤️';
  } else if (notification.type === 'comment') {
    message = `<strong>${notification.fromUser.username}</strong> commented on your post: "${notification.content}"`;
    icon = '💬';
  }

  const timestamp = new Date(notification.createdAt).toLocaleDateString();

  div.innerHTML = `
    <div class="notification-content">
      <span class="notification-icon">${icon}</span>
      <div class="notification-text">
        <p>${message}</p>
        <small class="notification-time">${timestamp}</small>
      </div>
    </div>
  `;

  return div;
}

function createUserCard(user) {
  const isFollowing = currentUser.following?.includes(user._id);
  
  const card = document.createElement('div');
  card.className = 'user-card';
  card.innerHTML = `
    <img src="${getAvatarURL(user)}" alt="${user.username}" />
    <h3>${user.username}</h3>
    <p>${user.bio || 'No bio'}</p>
    <p style="font-size: 12px; margin-bottom: 12px;">${user.followers.length} followers</p>
    <button class="follow-btn ${isFollowing ? 'following' : ''}" onclick="toggleFollow('${user._id}', this)">
      ${isFollowing ? 'Following' : 'Follow'}
    </button>
  `;
  
  return card;
}

async function toggleFollow(userId, button) {
  try {
    const isFollowing = button.classList.contains('following');
    const endpoint = isFollowing ? 'unfollow' : 'follow';
    
    const response = await fetch(`${API_BASE_URL}/users/${userId}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (response.ok) {
      button.classList.toggle('following');
      button.textContent = isFollowing ? 'Follow' : 'Following';
      loadProfile(); // Update follower count
    }
  } catch (error) {
    console.error('Error toggling follow:', error);
  }
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  const modal = document.getElementById('postModal');
  if (e.target === modal) {
    closePostModal();
  }
});
