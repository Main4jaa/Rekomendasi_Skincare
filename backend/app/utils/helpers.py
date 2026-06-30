def combine_cf(values):
    cf = 0.0
    for value in values:
        cf = cf + float(value) * (1 - cf)
    return round(cf, 4)
