
#1# SET UP & CLEAN THE DATA
# Load Libraries
library(tidyverse)
library(tidycensus)
library(readxl)
library(olsrr)
library(dplyr)
library(stringr)
library(lsr)
library(sf)
library(tigris)
library(moments)
library(scales)
library(ggplot2)
library(corrplot)
library(GGally)

# Sets the Current Working Directory
setwd("~/Desktop/PRATT/INFO 610/Final Project") 

# Read and Store Data
data <- read.csv("2023 ACS IPUMS Data 2.0.csv") 

# Create New Columns for Leadership Roles and Industries using OCC2010 codes
leadership <- c(0010, 0020, 0030, 0110, 0120, 0800, 0840, 0700, 0710, 2200, 0230, 2430, 2400, 1220, 1230, 0420, 2100, 3060, 3010, 3000, 3040, 3150, 3160, 3230)
data$leadership <- ifelse(data$OCC2010 %in% leadership, 1, 0)

corporate <- c(10, 20, 30, 100, 110, 120, 130, 140, 150, 160, 205, 220, 300, 310, 320, 330, 410, 430, 500, 510, 520, 530, 540, 560, 600, 620, 700, 710, 720, 730, 800, 810, 820, 830, 840, 850, 860, 910, 930, 940, 950, 1000, 1010, 1020, 1050, 1060, 1100, 1300, 1310, 1320, 1350, 1360, 1400, 1410, 1420, 1430, 1440, 1450, 1460, 1520, 1530, 1540, 1550, 1560, 2600, 2630, 2700, 2720, 2740, 2750, 2760, 2800, 2810, 2825, 2840, 2850, 2860, 2900, 2910, 2920, 4000, 4010, 4030, 4040, 4050, 4060, 4110, 4120, 4130, 4140, 4150, 4200, 4210, 4220, 4230, 4240, 4250, 4300, 4320, 4340, 4350, 4400, 4420, 4430, 4460, 4500, 4510, 4520, 4530, 4540, 4600, 4620, 4640, 4650, 4700, 4720, 4740, 4750, 4760, 4800, 4810, 4820, 4830, 4840, 4850, 4900, 4920, 4930, 4940, 4950, 4965, 5000, 5010, 5020, 5030, 5100, 5110, 5120, 5130, 5140, 5150, 5160, 5165, 5200, 5230, 5240, 5260, 5300, 5310, 5330, 5340, 5350, 5360, 5400, 5410, 5420, 5500, 5510, 5520, 5600, 5610, 5620, 5630, 5700, 5800, 5810, 5820, 5840, 5850, 5860, 5900, 5910, 5940, 6200, 6210, 6220, 6230, 6240, 6250, 6260, 6300, 6320, 6330, 6355, 6360, 6400, 6420, 6430, 6440, 6460, 6500, 6515, 6520, 6530, 6600, 6700, 6710, 6765, 6800, 6820, 6830, 6840, 6940, 7000, 7010, 7020, 7030, 7040, 7100, 7110, 7120, 7125, 7130, 7140, 7150, 7160, 7200, 7210, 7220, 7240, 7260, 7300, 7315, 7320, 7330, 7340, 7350, 7360, 7410, 7420, 7430, 7510, 7540, 7550, 7560, 7610, 7630, 7700, 7710, 7720, 7730, 7740, 7750, 7800, 7810, 7830, 7840, 7850, 7855, 7900, 7920, 7930, 7940, 7950, 7960, 8000, 8010, 8030, 8040, 8060, 8100, 8130, 8140, 8150, 8200, 8210, 8220, 8230, 8250, 8300, 8310, 8320, 8330, 8340, 8350, 8400, 8410, 8420, 8450, 8460, 8500, 8510, 8530, 8540, 8550, 8640, 8650, 8710, 8720, 8730, 8740, 8750, 8800, 8810, 8830, 8850, 8860, 8910, 8920, 8930, 8940, 8950, 8965, 9000, 9030, 9050, 9130, 9140, 9150, 9350, 9360, 9410, 9520, 9560, 9600, 9610, 9620, 9630, 9640, 9650, 9750)
academia <- c(230, 360, 1200, 1220, 1230, 1240, 1600, 1610, 1640, 1700, 1710, 1720, 1740, 1760, 1800, 1830, 1840, 1900, 1910, 1920, 1930, 1960, 1980, 2200, 2300, 2310, 2320, 2330, 2340, 2400, 2430, 2440, 2540, 2550, 5320, 5920)
publicsector <- c(420, 900, 2000, 2010, 2020, 2040, 2050, 2060, 2100, 2140, 2150, 3700, 3710, 3720, 3730, 3740, 3750, 3800, 3820, 3900, 3910, 3930, 3940, 3950, 5220, 5250, 5530, 5540, 5550, 5560, 6005, 6010, 6040, 6050, 6100, 6120, 6130, 6660, 6720, 6730, 6740, 8600, 8610, 8620, 8630, 9040, 9100, 9200, 9230, 9240, 9260, 9300, 9310, 9420, 9510, 9720, 9800, 9810, 9820, 9830)
healthcare <- c(350, 1650, 1820, 3000, 3010, 3030, 3040, 3050, 3060, 3110, 3120, 3130, 3140, 3150, 3160, 3200, 3210, 3220, 3230, 3240, 3250, 3260, 3300, 3310, 3320, 3400, 3410, 3500, 3510, 3520, 3530, 3540, 3600, 3610, 3620, 3630, 3640, 3650, 4610, 8760)
data$industry <- ifelse(data$OCC2010 %in% corporate, 'Corporate/Private Sector', 
                  ifelse(data$OCC2010 %in% academia, 'Academia & Research',
                  ifelse(data$OCC2010 %in% publicsector, 'Public Sector & Legal',
                  ifelse(data$OCC2010 %in% healthcare, 'Healthcare', 
                  ifelse(data$OCC2010 %in% c(9920), 'Unemployed',data$OCC2010)))))

# Create New Column for Filter Data for Black Women and Advanced Degrees (Master's, Professional, Doctoral)
data <- data %>%
  mutate(bwad = ifelse(RACBLK == 2 & SEX == 2 & EDUCD %in% c(114, 115, 116), 1, 0))

addata <- data %>%
  filter(EDUCD %in% c(114, 115, 116)) %>%                                                       # Filter for advanced degrees
  mutate(group = ifelse(RACBLK == 2 & SEX == 2, "Black Women", "All Other Races & Genders"))    # Filter for black women



#2# SUMMARIZE THE DATA
# Proportion of Black Women in Leadership Roles vs. All Others
groupleadership <- addata %>%
  group_by(group) %>%
  summarize(
    total = n(),
    in_leadership = sum(leadership == 1),
    proportion = in_leadership / total,
    percentage = (in_leadership / total) * 100)
print(groupleadership)

# Separated by Industry
groupleadership <- addata %>%
  group_by(industry, group) %>%
  summarize(
    total = n(),
    in_leadership = sum(leadership == 1),
    proportion = in_leadership / total,
    percentage = (in_leadership / total) * 100)
print(groupleadership)

# General Chi-Square Test
chisq_result <- chisq.test(table(addata$group, addata$leadership))
print(chisq_result)
chisq_result$observed
chisq_result$expected
chisq_result$residuals
chisq_result$stdres

# Chi-Square Test Separated by Industry
industries <- unique(addata$industry)
for (ind in industries) {
  cat("Industry:", ind, "\n")
  subset_data <- addata %>% filter(industry == ind)
  if (nrow(subset_data) > 0) {
    current_table <- table(subset_data$group, subset_data$leadership)
    chi_result <- chisq.test(current_table)
    
    # Print the main chi-square results
    print(chi_result)
    cat("\n")
    
    # Print observed, expected, residuals, and standardized residuals
    cat("Observed:\n")
    print(chi_result$observed)
    
    cat("Expected:\n")
    print(chi_result$expected)
    
    cat("Residuals:\n")
    print(chi_result$residuals)
    
    cat("Standardized Residuals:\n")
    print(chi_result$stdres)
    cat("\n--------------------------------------\n\n")
  } else {
    cat("No data for this industry.\n\n")
  }
}

# Linear Probability Model
model <- lm(leadership ~ group + industry, data = addata)
summary(model)



#3# VISUALIZE THE DATA
par(fg = "#dedede", col.axis = "#dedede", col.lab = "#dedede", col.main = "#dedede", col.sub = "#dedede", bg = "#000000")   # sets background color for subsequent plots
visualdata <- addata %>% filter(industry != "Unemployed")

# Overall Proportion in Leadership by Group
industry_summary <- visualdata %>%
  group_by(industry, group) %>%
  summarize(
    total = n(),
    in_leadership = sum(leadership == 1),
    proportion = in_leadership / total,
    percentage = (in_leadership / total) * 100,
    .groups = "drop")

ggplot(industry_summary, aes(x = industry, y = proportion, fill = group)) +
  geom_col(position = "dodge") +
  geom_text(aes(label = sprintf("%.3g", percentage)),
            position = position_dodge(width = 0.9),
            vjust = 1.5,
            color = "#000000",
            size = 3,
            fontface = "bold") +
  scale_y_continuous(labels = scales::percent) +
  scale_fill_manual(values = c("Black Women" = "#b9c94b", "All Other Races & Genders" = "#e68c45")) +
  labs(
    title = "Leadership Representation Across Industries for Advanced Degree Holders",
    x = "Industry",
    y = "Proportion in Leadership",
    fill = "Legend"
  ) +
  theme_minimal() +
  theme(
    axis.text = element_text(color = "#dedede"),
    axis.text.x = element_text(angle = 45, hjust = 1),
    text = element_text(color = "#dedede"),
    plot.background = element_rect(fill = "#000000", color = NA),
    panel.background = element_rect(fill = "#00000095", color = NA)
    )

# Corrplot to Visualize Chi-Square Test Residuals
corrdata <- visualdata %>%
  mutate(group_industry = interaction(group, industry, sep = " / "))
full_table <- table(corrdata$group_industry, corrdata$leadership)
full_chi <- chisq.test(full_table)
residuals_matrix <- as.matrix(full_chi$residuals)
dimnames(residuals_matrix)[[2]] <- c("Non-Leadership", "Leadership")
my_colors <- colorRampPalette(c("#b78ecb", "#dedede", "#70c0b1"))(200)

corrplot(residuals_matrix, 
         is.corr = FALSE, 
         method = "color", 
         col = my_colors,
         tl.col = "#dedede",
         tl.srt = 45,                  
         tl.cex = 0.9,                 
         cl.cex = 1.1,
         cl.ratio = 0.7,
         cl.align.text = "l",   
         addgrid.col = NA,
         addCoef.col = "#000000",  
         number.cex = 0.7,       
         number.digits = 2,
         title = "Chi-Square Residuals For All Industries",
         mar = c(2, 1, 2, 8))   



