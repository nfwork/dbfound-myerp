package com.nfwork.erp.dto;

import java.math.BigDecimal;

public class AccountGroupItem {

    private Integer accountId;
    private Integer periodCode;
    private BigDecimal amount = BigDecimal.ZERO;

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public Integer getPeriodCode() {
        return periodCode;
    }

    public void setPeriodCode(Integer periodCode) {
        this.periodCode = periodCode;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
