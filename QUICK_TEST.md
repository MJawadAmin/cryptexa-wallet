# 🎯 Quick Test Guide

## Load Extension (2 minutes)

### Step 1: Open Chrome Extensions
```
chrome://extensions/
```
or click: ⋮ (menu) → Extensions → Manage Extensions

### Step 2: Enable Developer Mode
Toggle "Developer mode" in top-right corner ↗️

### Step 3: Load Extension
1. Click "Load unpacked" button
2. Navigate to: `E:\Desktop\Office Works\Client Work\cryptexa-wallet\dist`
3. Select folder and click "Select Folder"

### Step 4: Verify
✅ Icon appears in toolbar (gradient wallet icon)
✅ Click icon → popup opens (360x600px)

---

## Test Features (5 minutes)

### 1. **Test Toast Notifications**
- Click address → ✅ Green toast: "Address copied!"
- Click refresh → ℹ️ Blue toast: "Refreshing..." → ✅ "Balance updated!"

### 2. **Test Loading States**
- Click "Create New Account" → Loading overlay appears
- Wait for completion → Account created with toast

### 3. **Test Animations**
- Hover over buttons → Lift effect + shine
- Hover over cards → Lift with shadow
- Open modals → Smooth scale-in animation

### 4. **Test Account Switching**
- Click accounts modal (top right user icon)
- Switch between accounts → Smooth transition
- Create new account → Loading state + toast

### 5. **Test Error Handling**
- Try invalid operation → Red error toast
- All errors logged to console

---

## Visual Checklist

✅ **Icons**
- [ ] Toolbar icon is gradient (purple/pink)
- [ ] Icon is sharp, not pixelated
- [ ] Multiple sizes load correctly

✅ **UI Elements**
- [ ] Buttons have hover lift effect
- [ ] Buttons show shine on hover
- [ ] Cards lift on hover
- [ ] Scrollbar is styled (gradient thumb)

✅ **Toasts**
- [ ] Success toasts are green
- [ ] Error toasts are red
- [ ] Info toasts are blue
- [ ] Toasts auto-dismiss after 3s
- [ ] Close button works

✅ **Loading**
- [ ] Loading overlay has spinner
- [ ] Progress bar animates
- [ ] Message displays correctly
- [ ] Backdrop blur effect works

✅ **Animations**
- [ ] All transitions are smooth (300ms)
- [ ] No janky animations
- [ ] Animations complete properly

---

## Professional Assessment

### ✅ Looks Professional When:
- Smooth animations everywhere
- Immediate feedback on all actions
- Clear visual hierarchy
- Consistent spacing and colors
- No errors in console
- Icons are high quality

### ❌ Looks AI-Generated When:
- No feedback on actions
- Janky/slow animations
- Inconsistent styling
- Low quality icons
- Errors visible to user

---

## Quick Fixes

**Icons not showing:**
```bash
# Verify files exist
ls dist/icons/

# Should see:
icon16.png
icon32.png
icon48.png
icon128.png
```

**Toasts not appearing:**
```bash
# Check browser console for errors
# Verify ToastContainer is in MainWallet.tsx
```

**Build failed:**
```bash
npm run build
# Check for TypeScript errors
```

---

## One-Command Test

Open Chrome → `chrome://extensions/` → Developer mode ON → Load unpacked → Select `dist/` folder → Click extension icon → Test all features ✅

**Expected Time:** 2-3 minutes for full professional validation
