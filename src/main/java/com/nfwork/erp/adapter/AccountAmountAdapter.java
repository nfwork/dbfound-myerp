package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.model.adapter.QueryAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.erp.dto.AccountAmountItem;
import com.nfwork.erp.dto.AccountGroupItem;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AccountAmountAdapter implements QueryAdapter<AccountAmountItem> {
    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<AccountAmountItem> responseObject) {
        int periodId = (Integer) params.get("period_id").getValue();
        Map<Integer,AccountAmountItem>  accountMap = new HashMap<>();
        for(AccountAmountItem item : responseObject.getDatas()){
            accountMap.put(item.getAccountId(),item);
        }
        List<AccountGroupItem> itemList = ModelEngine.query(context,"report/accountAmountQuery","getGroupData",AccountGroupItem.class).getDatas();
        for (AccountGroupItem item : itemList){
            AccountAmountItem amountItem = accountMap.get(item.getAccountId());
            if(item.getPeriodId() == periodId){
                amountItem.setEmergeAmount(item.getAmount());
            }else{
                amountItem.setRemaindAmount(amountItem.getRemaindAmount() + item.getAmount());
            }
        }
        for(AccountAmountItem item : responseObject.getDatas()){
            item.setEndAmount(item.getEmergeAmount() + item.getRemaindAmount());
        }
    }
}
