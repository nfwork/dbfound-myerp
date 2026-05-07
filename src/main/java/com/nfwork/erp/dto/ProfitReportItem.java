package com.nfwork.erp.dto;

import java.math.BigDecimal;

public class ProfitReportItem {

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private String profitPeriod;

    private BigDecimal total = ZERO;
    private BigDecimal channelPf = ZERO;
    private BigDecimal channelZs = ZERO;
    private BigDecimal channelJt = ZERO;
    private BigDecimal channelAl = ZERO;
    private BigDecimal channelJj = ZERO;

    private transient BigDecimal recordTotal = ZERO;
    private transient BigDecimal recordPf = ZERO;
    private transient BigDecimal recordZs = ZERO;
    private transient BigDecimal recordJt = ZERO;
    private transient BigDecimal recordAl = ZERO;
    private transient BigDecimal recordJj = ZERO;

    private transient BigDecimal archiveTotal = ZERO;
    private transient BigDecimal archivePf = ZERO;
    private transient BigDecimal archiveZs = ZERO;
    private transient BigDecimal archiveJt = ZERO;
    private transient BigDecimal archiveAl = ZERO;
    private transient BigDecimal archiveJj = ZERO;

    public static ProfitReportItem emptyRecord() {
        return new ProfitReportItem();
    }

    public void calculateWithPrevious(ProfitReportItem previous) {
        total = recordTotal.subtract(previous.recordTotal).add(archiveTotal);
        channelPf = recordPf.subtract(previous.recordPf).add(archivePf);
        channelZs = recordZs.subtract(previous.recordZs).add(archiveZs);
        channelJt = recordJt.subtract(previous.recordJt).add(archiveJt);
        channelAl = recordAl.subtract(previous.recordAl).add(archiveAl);
        channelJj = recordJj.subtract(previous.recordJj).add(archiveJj);
    }

    public String getProfitPeriod() {
        return profitPeriod;
    }

    public void setProfitPeriod(String profitPeriod) {
        this.profitPeriod = profitPeriod;
    }

    public BigDecimal getTotal() {
        return total;
    }

    public BigDecimal getChannelPf() {
        return channelPf;
    }

    public BigDecimal getChannelZs() {
        return channelZs;
    }

    public BigDecimal getChannelJt() {
        return channelJt;
    }

    public BigDecimal getChannelAl() {
        return channelAl;
    }

    public BigDecimal getChannelJj() {
        return channelJj;
    }

    public void setRecordTotal(Object recordTotal) {
        this.recordTotal = toAmount(recordTotal);
    }

    public void setRecordPf(Object recordPf) {
        this.recordPf = toAmount(recordPf);
    }

    public void setRecordZs(Object recordZs) {
        this.recordZs = toAmount(recordZs);
    }

    public void setRecordJt(Object recordJt) {
        this.recordJt = toAmount(recordJt);
    }

    public void setRecordAl(Object recordAl) {
        this.recordAl = toAmount(recordAl);
    }

    public void setRecordJj(Object recordJj) {
        this.recordJj = toAmount(recordJj);
    }

    public void setArchiveTotal(Object archiveTotal) {
        this.archiveTotal = toAmount(archiveTotal);
    }

    public void setArchivePf(Object archivePf) {
        this.archivePf = toAmount(archivePf);
    }

    public void setArchiveZs(Object archiveZs) {
        this.archiveZs = toAmount(archiveZs);
    }

    public void setArchiveJt(Object archiveJt) {
        this.archiveJt = toAmount(archiveJt);
    }

    public void setArchiveAl(Object archiveAl) {
        this.archiveAl = toAmount(archiveAl);
    }

    public void setArchiveJj(Object archiveJj) {
        this.archiveJj = toAmount(archiveJj);
    }

    private BigDecimal toAmount(Object value) {
        if (value == null) {
            return ZERO;
        }
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number) {
            return BigDecimal.valueOf(((Number) value).doubleValue());
        }
        return new BigDecimal(value.toString());
    }
}
