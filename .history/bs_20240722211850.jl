using Distributions

function cdf(x::Float64)
    return cdf(Normal(0, 1), x)
end

function blackScholesPut(S::Float64, K::Float64, T::Float64, r::Float64, sigma::Float64)
    d1 = (log(S / K) + (r + 0.5 * sigma^2) * T) / (sigma * sqrt(T))
    d2 = d1 - sigma * sqrt(T)
    return K * exp(-r * T) * cdf(-d2) - S * cdf(-d1)
end

S = 100.0      # Underlying asset price
K = 100.0      # Strike price
T = 1.0        # Time to expiration in years
r = 0.05       # Risk-free interest rate
sigma = 0.2    # Volatility

putPrice = blackScholesPut(S, K, T, r, sigma)
print("European Put Option Price: \$", putPrice)
