# Admin Withdrawals Page - USDT Support Update Needed

## What's Been Done ✅

1. **Profile Page** - Added USDT payout method selection with wallet address fields
2. **Affiliate Withdrawals Page** - Complete USDT support with TRC20/BEP20 options
3. **Minimum withdrawal** changed from $5 to $10

## What Still Needs to Be Done 🔧

### Admin Withdrawals Page Updates

In `webearn/src/app/(admin)/admin/withdrawals/page.tsx`:
- Add `payout_method`, `wallet_address`, `network` to the SELECT query (around line 33)

In `webearn/src/app/(admin)/admin/withdrawals/WithdrawalsTable.tsx`:
1. Update the `Withdrawal` interface to include:
   - `payout_method?: string`
   - `wallet_address?: string`  
   - `network?: string`

2. Add a "Method" column to the table header (after "Amount", before "Status")

3. Display payout method badge in the table:
   ```tsx
   {withdrawal.payout_method === "usdt" ? (
     <Badge className="bg-emerald-100 text-emerald-800">USDT</Badge>
   ) : (
     <Badge className="bg-blue-100 text-blue-800">Bank</Badge>
   )}
   ```

4. In the expanded row details section (around line 248), add conditional display:
   ```tsx
   <h4 className="font-semibold text-foreground">
     {withdrawal.payout_method === "usdt" ? "Wallet Details" : "Bank Details"}
   </h4>
   
   {withdrawal.payout_method === "usdt" ? (
     <div className="grid grid-cols-2 gap-4 text-sm">
       <div>
         <p className="text-muted">Wallet Address</p>
         <p className="font-semibold font-mono text-xs break-all">
           {withdrawal.wallet_address}
         </p>
       </div>
       <div>
         <p className="text-muted">Network</p>
         <p className="font-semibold">{withdrawal.network || "TRC20"}</p>
       </div>
     </div>
   ) : (
     // Existing bank details display
   )}
   ```

## Testing Checklist

- [ ] Run `ADD-USDT-PAYOUT.sql` in Supabase (if you haven't yet)
- [ ] Profile page allows selecting USDT or Bank
- [ ] Profile page validates TRC20 addresses (start with T, 34 chars)
- [ ] Withdrawal request shows correct fields based on selected method
- [ ] Minimum $10 validation works
- [ ] Admin page displays payout method badge
- [ ] Admin page shows wallet address for USDT withdrawals
- [ ] Admin page shows bank details for bank withdrawals
- [ ] Approve/Mark as Paid/Reject actions still work

## Notes

- USDT is now the **recommended default** method (works worldwide)
- Bank transfer is **secondary/fallback** (may not work in all countries)
- Minimum withdrawal is **$10** (previously $5)
- TRC20 is default network (lower fees than BEP20)
- Wallet addresses are validated client-side with regex
- Payment details are snapshot at withdrawal request time
