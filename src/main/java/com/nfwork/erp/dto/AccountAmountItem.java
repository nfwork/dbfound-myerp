package com.nfwork.erp.dto;

public class AccountAmountItem {

    private Integer accountId;

    private String accountName;

    private String accountCode;

    private double remaindAmount;

    private double emergeAmount;

    private double endAmount;

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

    public double getRemaindAmount() {
        return remaindAmount;
    }

    public void setRemaindAmount(double remaindAmount) {
        this.remaindAmount = remaindAmount;
    }

    public double getEmergeAmount() {
        return emergeAmount;
    }

    public void setEmergeAmount(double emergeAmount) {
        this.emergeAmount = emergeAmount;
    }

    public double getEndAmount() {
        return endAmount;
    }

    public void setEndAmount(double endAmount) {
        this.endAmount = endAmount;
    }

    public String getAccountCode() {
        return accountCode;
    }

    public void setAccountCode(String accountCode) {
        this.accountCode = accountCode;
    }
}
