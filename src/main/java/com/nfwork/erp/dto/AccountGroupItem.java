package com.nfwork.erp.dto;

import java.math.BigDecimal;

public class AccountGroupItem {

    private Integer accountId;
    private Integer periodId;
    private BigDecimal amount = BigDecimal.ZERO;

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public Integer getPeriodId() {
        return periodId;
    }

    public void setPeriodId(Integer periodId) {
        this.periodId = periodId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
