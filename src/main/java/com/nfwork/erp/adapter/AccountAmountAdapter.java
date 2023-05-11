package com.nfwork.erp.adapter;

import com.nfwork.dbfound.core.Context;
import com.nfwork.dbfound.dto.QueryResponseObject;
import com.nfwork.dbfound.model.ModelEngine;
import com.nfwork.dbfound.model.adapter.QueryAdapter;
import com.nfwork.dbfound.model.bean.Param;
import com.nfwork.erp.dto.AccountAmountItem;
import com.nfwork.erp.dto.AccountGroupItem;

import java.util.List;
import java.util.Map;

public class AccountAmountAdapter implements QueryAdapter<AccountAmountItem> {
    @Override
    public void afterQuery(Context context, Map<String, Param> params, QueryResponseObject<AccountAmountItem> responseObject) {
        int periodForm = params.get("period_code_from").getIntValue();
        int periodTo = params.get("period_code_to").getIntValue();
        Map<String,AccountAmountItem> accountMap = responseObject.getMap("account_id");

        List<AccountGroupItem> itemList = ModelEngine.query(context,"report/accountAmountQuery","getGroupData",AccountGroupItem.class).getDatas();
        for (AccountGroupItem item : itemList){
            AccountAmountItem amountItem = accountMap.get(item.getAccountId().toString());
            if(item.getPeriodCode() >= periodForm && item.getPeriodCode() <= periodTo){
                amountItem.setEmergeAmount(amountItem.getEmergeAmount().add(item.getAmount()));
            }else{
                amountItem.setRemaindAmount(amountItem.getRemaindAmount().add(item.getAmount()));
            }
        }
        for(AccountAmountItem item : responseObject.getDatas()){
            item.setEndAmount(item.getEmergeAmount().add(item.getRemaindAmount()));
        }
    }
}
