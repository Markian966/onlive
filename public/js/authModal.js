const openAuthModalBtn = document.getElementById('openAuthModal');
const authModal = document.getElementById('authModal');
const closeModalBtn = document.getElementById('closeModal');
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

openAuthModalBtn?.addEventListener('click', () => {
    authModal.classList.remove('hidden');
});

closeModalBtn?.addEventListener('click', () => {
    authModal.classList.add('hidden');
});

authModal?.addEventListener('click', e => {
    if (e.target === authModal) authModal.classList.add('hidden');
});

loginTab?.addEventListener('click', () => {
    loginTab.classList.add('active');
    registerTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

registerTab?.addEventListener('click', () => {
    registerTab.classList.add('active');
    loginTab.classList.remove('active');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

function saveToken(token) {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1);
    document.cookie = `token=${token}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
}
loginForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    try {
        const res = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            saveToken(data.token);
            
            console.log('Login successful:', data.user);
            
            window.location.reload();
        } else {
            document.getElementById('loginError').textContent = data.message || 'Login failed';
        }
    } catch (err) {
        console.error('Login error:', err);
        document.getElementById('loginError').textContent = 'Server error. Please try again.';
    }
});

registerForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const name = registerForm.name.value;
    const email = registerForm.email.value;
    const password = registerForm.password.value;

    try {
        const res = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await res.json();
        
        if (res.ok) {
            saveToken(data.token);
            
            console.log('Registration successful:', data.user);
            
            window.location.reload();
        } else {
            document.getElementById('registerError').textContent = data.message || 'Registration failed';
        }
    } catch (err) {
        console.error('Registration error:', err);
        document.getElementById('registerError').textContent = 'Server error. Please try again.';
    }
});

