using Distributions

const N = Normal(0, 1)

function blackScholes(S::Float64, K::Float64, T::Float64, r::Float64, sigma::Float64, is_call::Bool)
    σ_sqrt_T = sigma * sqrt(T)
    d1 = (log(S / K) + (r + 0.5 * sigma^2) * T) / σ_sqrt_T
    d2 = d1 - σ_sqrt_T
    
    if is_call
        return S * cdf(N, d1) - K * exp(-r * T) * cdf(N, d2)
    else
        return K * exp(-r * T) * cdf(N, -d2) - S * cdf(N, -d1)
    end
end

blackScholesPut(S::Float64, K::Float64, T::Float64, r::Float64, sigma::Float64) = 
    blackScholes(S, K, T, r, sigma, false)

blackScholesCall(S::Float64, K::Float64, T::Float64, r::Float64, sigma::Float64) = 
    blackScholes(S, K, T, r, sigma, true)