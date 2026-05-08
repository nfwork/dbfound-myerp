package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.model.adapter.QueryAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.erp.dto.AccountAmountItem;

import java.util.List;
import java.util.Map;

public class AccountAmountAdapter implements QueryAdapter<AccountAmountItem> {
    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<AccountAmountItem> responseObject) {
        Map<String,AccountAmountItem> accountMap = responseObject.getMap("account_id");

        List<AccountAmountItem> itemList = ModelEngine.query(context,"report/accountAmountQuery","getGroupData",AccountAmountItem.class).getDatas();
        for (AccountAmountItem item : itemList){
            AccountAmountItem amountItem = accountMap.get(item.getAccountId().toString());
            if(amountItem != null){
                amountItem.setEmergeAmount(item.getEmergeAmount());
                amountItem.setRemaindAmount(item.getRemaindAmount());
                amountItem.setEndAmount(amountItem.getEmergeAmount().add(amountItem.getRemaindAmount()));
            }
        }
    }
}
