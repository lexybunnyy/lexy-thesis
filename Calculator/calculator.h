#ifndef _CALCULATOR_H
#define _CALCULATOR_H

#include <iostream>
#include <stdio.h>
#include <math.h>
#include <vector>
#include <algorithm>
#include "logTest.h"
#define PI 3.14159265

using namespace std;

typedef vector<vector<double> > DMatrix;
typedef vector<double> DArray;

/** @name Számítási függvények */
//@{
	DArray interpolateMain (DArray &x, DMatrix &M, string type = "lagrange", bool inverse = false);
	//DArray interpolateMain (DArray &x, DMatrix &M);
	/** Interpolációs Táblázat kiszámítása */
	void interpolateMatrix(DArray &x, DMatrix &M);
	/** Lagrange polinom számítás segédfüggvénye */
	DArray l(int j, DArray X);
	/** Lagrange polinom számítás */
	DArray getLagrangePolinomyal(DArray X, DArray Y);
	/** Newton polinom számítás segédfüggvénye */
	DArray omega(int j, DArray X);
	/** Newton polinom számítás */
	DArray getNewtonPolinomyal(DArray inpX, DArray inpMDiag);
	/** Newton polinom összeadás */
	DArray polynomialAddition(DArray P, DArray Q);
	/** Newton polinom szorzás */
	DArray polynomialMultiply(DArray P, DArray Q);
	/** Polinom egyszerűsítés */
	void polynomialSimplfy(DArray &P);
//@}

/** @name Típus konverziós függvények */
//@{
	/** Diagonális lekérése a mátrixból*/
	DArray getDiagFromMatrix (DMatrix &M);
	/** X és Y ponthalmazból vissza adja a Mátrixot */
	void getInterpolationMatrix(DArray X, DMatrix Y, DArray &resX, DMatrix &resM);
//@}

#endif