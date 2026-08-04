(function() {
  const IS_AUTHED = sessionStorage.getItem('gashi_auth') === 'true';

  if (window.location.pathname.includes('/dashboard/') && !IS_AUTHED) {
    document.body.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&family=Roboto:wght@400;500&display=swap');
        
        body {
          margin: 0; padding: 0;
          background: url('../assets/images/header1.jpg') center/cover no-repeat;
          font-family: 'Roboto', sans-serif;
          height: 100vh;
          overflow: hidden;
        }
        
        .auth-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(10px);
          display: flex; align-items: center; justify-content: center;
          z-index: 9999;
        }

        .auth-card {
          background: rgba(20, 20, 20, 0.85);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 50px 40px;
          width: 100%; max-width: 420px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1);
          text-align: center;
          animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(20px);
        }

        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }

        .auth-card h2 {
          font-family: 'Oswald', sans-serif;
          color: #fff;
          font-size: 32px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0 0 10px 0;
        }

        .auth-card p {
          color: #aaa;
          font-size: 14px;
          margin-bottom: 30px;
        }

        .input-group {
          position: relative;
          margin-bottom: 20px;
          text-align: left;
        }

        .input-group label {
          display: block;
          font-family: 'Oswald', sans-serif;
          color: #ccc;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }

        .input-group input {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 14px 16px;
          border-radius: 8px;
          color: #fff;
          font-family: 'Roboto', sans-serif;
          font-size: 15px;
          transition: 0.2s all;
          box-sizing: border-box;
          outline: none;
        }

        .input-group input:focus {
          border-color: #f37423;
          background: rgba(0,0,0,0.5);
          box-shadow: 0 0 0 3px rgba(243, 116, 35, 0.2);
        }

        .auth-btn {
          width: 100%;
          background: #f37423;
          color: #fff;
          border: none;
          padding: 16px;
          border-radius: 8px;
          font-family: 'Oswald', sans-serif;
          font-size: 16px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
          cursor: pointer;
          transition: 0.2s all;
          margin-top: 10px;
          box-shadow: 0 4px 15px rgba(243, 116, 35, 0.3);
        }

        .auth-btn:hover {
          background: #ff8b40;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(243, 116, 35, 0.4);
        }

        .auth-error {
          background: rgba(255, 50, 50, 0.1);
          color: #ff5555;
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          margin-bottom: 20px;
          border: 1px solid rgba(255, 50, 50, 0.2);
          display: none;
        }
      </style>

      <div class="auth-overlay">
        <div class="auth-card">
          <h2>Dashboard Portal</h2>
          <p>Secure access for Gashi-k9 administration.</p>
          
          <div class="auth-error" id="auth-error">Incorrect credentials. Access denied.</div>
          
          <div class="input-group">
            <label>Admin Email</label>
            <input type="email" id="auth-email" placeholder="gashikennel@gmail.com" value="gashikennel@gmail.com">
          </div>
          
          <div class="input-group">
            <label>Master Password</label>
            <input type="password" id="auth-password" placeholder="Enter your password">
          </div>
          
          <button class="auth-btn" id="auth-submit">Authenticate</button>
        </div>
      </div>
    `;

    document.getElementById('auth-submit').addEventListener('click', () => {
      const email = document.getElementById('auth-email').value;
      const pass = document.getElementById('auth-password').value;
      
      if (email === 'gashikennel@gmail.com' && pass === 'bledi.123') {
        sessionStorage.setItem('gashi_auth', 'true');
        window.location.reload();
      } else {
        const err = document.getElementById('auth-error');
        err.style.display = 'block';
        err.animate([
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(5px)' },
          { transform: 'translateX(-5px)' },
          { transform: 'translateX(0)' }
        ], { duration: 300 });
      }
    });
    
    document.getElementById('auth-password').addEventListener('keyup', (e) => {
      if (e.key === 'Enter') document.getElementById('auth-submit').click();
    });
  }
})();
