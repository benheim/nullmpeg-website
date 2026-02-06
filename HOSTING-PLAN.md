# nullmpeg.xyz Hosting Plan

## Project Overview
- **Site**: Y2K-style landing page for null brand
- **Tech**: React + Vite (static build)
- **Domain**: nullmpeg.xyz (registered on GoDaddy)
- **Current state**: Built site exists in `/dist`

---

## Recommended Hosting Solution: **Vercel** (Primary) or **Cloudflare Pages** (Alternative)

### Why Vercel?
1. **Free forever** for static sites
2. **Zero-config deployment** for Vite projects
3. **Automatic HTTPS** + global CDN
4. **Git-based deployments** (auto-deploy on push)
5. **Custom domain setup** is straightforward
6. **Preview deployments** for every branch/PR
7. **Excellent DX** (CLI + dashboard)

### Why Cloudflare Pages (alternative)?
1. **Free** with generous limits
2. **Fast global CDN** (Cloudflare network)
3. **Built-in analytics** (free)
4. **Workers integration** (if you need backend later)
5. **Good DNS integration** if you move DNS to Cloudflare

---

## Deployment Steps (Vercel)

### 1. **Prepare the repo**
```bash
cd C:\Users\benhe\clawd\projects\nullmpeg-website

# Initialize git if not already
git init
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
gh repo create benheim/nullmpeg-xyz --public --source=. --remote=origin --push
```

### 2. **Deploy to Vercel**

**Option A: Via Vercel CLI** (fastest)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd C:\Users\benhe\clawd\projects\nullmpeg-website
vercel

# Follow prompts:
# - Link to your Vercel account (login via browser)
# - Confirm project settings
# - Deploy
```

**Option B: Via Vercel Dashboard**
1. Go to https://vercel.com
2. Sign up/login (use GitHub auth)
3. Click "Add New" → "Project"
4. Import the GitHub repo
5. Vercel auto-detects Vite config
6. Click "Deploy"

### 3. **Connect custom domain (nullmpeg.xyz)**

**In Vercel Dashboard:**
1. Go to Project Settings → Domains
2. Add `nullmpeg.xyz` and `www.nullmpeg.xyz`
3. Vercel will show DNS records to add

**In GoDaddy DNS:**
1. Go to GoDaddy → Domain Settings → DNS Management
2. Add the records Vercel shows:
   - **A record** for `nullmpeg.xyz` → `76.76.21.21` (Vercel IP)
   - **CNAME** for `www` → `cname.vercel-dns.com`
3. Save and wait for propagation (5-60 min)

---

## Alternative: Cloudflare Pages Deployment

### 1. **Push to GitHub** (same as above)

### 2. **Deploy to Cloudflare Pages**
1. Go to https://dash.cloudflare.com
2. Navigate to "Workers & Pages" → "Create application" → "Pages"
3. Connect GitHub and select the repo
4. Build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Framework preset**: Vite
5. Click "Save and Deploy"

### 3. **Connect domain**
1. In Cloudflare Pages → Custom domains
2. Add `nullmpeg.xyz`
3. If DNS is already on Cloudflare, it auto-configures
4. If DNS is on GoDaddy:
   - Add CNAME: `nullmpeg.xyz` → `[your-project].pages.dev`
   - Or migrate DNS to Cloudflare (recommended)

---

## DNS Configuration Options

### Option 1: Keep DNS on GoDaddy (Simplest)
- Just add the A/CNAME records Vercel/Cloudflare provides
- Works fine but slower DNS updates

### Option 2: Move DNS to Cloudflare (Recommended)
**Benefits:**
- Faster DNS propagation
- Free CDN + DDoS protection
- Better analytics
- Integration with Cloudflare Pages

**Steps:**
1. Go to Cloudflare → Add Site → Enter nullmpeg.xyz
2. Cloudflare scans existing DNS records
3. Copy the Cloudflare nameservers
4. Go to GoDaddy → Domain Settings → Nameservers → Custom
5. Replace with Cloudflare nameservers
6. Wait 24-48h for propagation

---

## Additional Setup (Optional but Recommended)

### 1. **Email forwarding** (if needed)
- **GoDaddy**: Offers email forwarding (e.g., hello@nullmpeg.xyz → your personal email)
- **Cloudflare**: Free email routing if DNS is on Cloudflare
- **ImprovMX**: Free email forwarding service (works with any DNS)

### 2. **Analytics**
- **Vercel Analytics**: Free tier available
- **Cloudflare Web Analytics**: Free (privacy-friendly)
- **Google Analytics**: Classic option

### 3. **Environment variables** (for future features)
- Vercel: Dashboard → Project Settings → Environment Variables
- Cloudflare Pages: Settings → Environment Variables

### 4. **CI/CD setup**
Both Vercel and Cloudflare auto-deploy on git push to main. No extra CI needed.

---

## Cost Breakdown

### Free tier (recommended for now):
- **Hosting**: $0/month (Vercel or Cloudflare Pages)
- **Domain**: ~$12/year (already paid on GoDaddy)
- **SSL**: $0 (included with both hosts)
- **CDN**: $0 (included)
- **Total**: ~$1/month

### If you need more later:
- **Vercel Pro**: $20/month (unlimited bandwidth, better limits)
- **Cloudflare Workers**: $5/month (if you add backend features)

---

## Recommended Plan: **Vercel (GitHub-based deployment)**

**Why this combo?**
1. Free hosting forever
2. Auto-deploy on git push
3. Easy domain setup
4. Best DX for Vite projects
5. Preview deployments for testing

**Next steps:**
1. Push code to GitHub
2. Deploy via Vercel CLI or dashboard
3. Add custom domain in Vercel
4. Update DNS on GoDaddy
5. Done ✓

---

## Backup/Redundancy (Optional)

If you want belt-and-suspenders:
1. **Primary**: Vercel
2. **Backup**: Cloudflare Pages (deploy same repo)
3. **Failover**: Use Cloudflare Load Balancing to auto-switch if Vercel goes down (overkill for a landing page but possible)

---

## Email Setup (if needed)

**For hello@nullmpeg.xyz or contact@nullmpeg.xyz:**

### Option 1: Email forwarding (simplest)
1. **GoDaddy Email Forwarding** (free with domain):
   - GoDaddy → Email → Forwarding
   - Add: `hello@nullmpeg.xyz` → forwards to your personal email
   
2. **ImprovMX** (free alternative):
   - Go to improvmx.com
   - Add nullmpeg.xyz
   - Add MX records to GoDaddy DNS
   - Setup forwarding aliases

### Option 2: Full email hosting
- **Google Workspace**: $6/user/month
- **ProtonMail**: $4/month
- **Migadu**: $19/year (unlimited aliases)

**Recommendation**: Use GoDaddy's free email forwarding for now.

---

## Timeline

**Immediate** (today):
1. Push to GitHub: 5 min
2. Deploy to Vercel: 10 min
3. Add custom domain: 5 min
4. Update GoDaddy DNS: 5 min
5. Wait for DNS propagation: 10-60 min

**Total active work**: ~30 minutes
**Total time to live**: 1-2 hours (including DNS propagation)

---

## Monitoring & Maintenance

**Post-deployment checklist:**
- [ ] Verify site loads at nullmpeg.xyz
- [ ] Check HTTPS works (should be automatic)
- [ ] Test on mobile
- [ ] Verify all links work (IG, YouTube, Twitch)
- [ ] Set up uptime monitoring (optional):
  - UptimeRobot (free)
  - Better Stack (free tier)

**Ongoing maintenance:**
- Update content: commit + push to GitHub → auto-deploys
- Monitor: Vercel/Cloudflare dashboard shows traffic/errors
- Domain renewal: Annual (GoDaddy will email reminder)

---

## Next Steps (Your Action Items)

1. **Decision**: Vercel or Cloudflare Pages? (Recommend Vercel)
2. **Push to GitHub**: Create repo and push code
3. **Deploy**: Follow Vercel deployment steps above
4. **DNS**: Add records to GoDaddy
5. **Test**: Verify site is live
6. **Optional**: Set up email forwarding

**Want me to help with any of these steps?**
