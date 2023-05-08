package com.nfwork.erp.dto;

import java.math.BigDecimal;

public class AccountAmountItem {

    private Integer accountId;

    private String accountName;

    private String accountCode;

    private BigDecimal remaindAmount = BigDecimal.ZERO;

    private BigDecimal emergeAmount = BigDecimal.ZERO;

    private BigDecimal endAmount = BigDecimal.ZERO;

    public Integer getAccountId() {
        return accountId;
    }

    public void setAccountId(Integer accountId) {
        this.accountId = accountId;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public BigDecimal getRemaindAmount() {
        return remaindAmount;
    }

    public void setRemaindAmount(BigDecimal remaindAmount) {
        this.remaindAmount = remaindAmount;
    }

    public BigDecimal getEmergeAmount() {
        return emergeAmount;
    }

    public void setEmergeAmount(BigDecimal emergeAmount) {
        this.emergeAmount = emergeAmount;
    }

    public BigDecimal getEndAmount() {
        return endAmount;
    }

    public void setEndAmount(BigDecimal endAmount) {
        this.endAmount = endAmount;
    }

    public String getAccountCode() {
        return accountCode;
    }

    public void setAccountCode(String accountCode) {
        this.accountCode = accountCode;
    }
}
